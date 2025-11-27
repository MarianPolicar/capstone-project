import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

// Booking System Server - Last updated: 2024-11-24
console.log('🚀 Starting Booking System Server...');
console.log('Environment check:');
console.log('- SUPABASE_URL:', Deno.env.get('SUPABASE_URL') ? '✅ Set' : '❌ Missing');
console.log('- SUPABASE_SERVICE_ROLE_KEY:', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? '✅ Set' : '❌ Missing');

const app = new Hono();

app.use('*', logger(console.log));
app.use('*', cors());

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Health check
app.get('/make-server-6c7ad85d/health', (c) => {
  return c.json({ status: 'healthy' });
});

// Sign up endpoint
app.post('/make-server-6c7ad85d/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Sign up error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store user role in KV store
    await kv.set(`user:${data.user.id}:role`, 'user');

    return c.json({ 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
        role: 'user'
      }
    });
  } catch (error) {
    console.log(`Sign up error: ${error}`);
    return c.json({ error: 'Failed to create account' }, 500);
  }
});

// Get user info
app.get('/make-server-6c7ad85d/user', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Get user error: ${error?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const role = await kv.get(`user:${user.id}:role`) || 'user';

    return c.json({
      id: user.id,
      email: user.email,
      name: user.user_metadata.name,
      role
    });
  } catch (error) {
    console.log(`Get user error: ${error}`);
    return c.json({ error: 'Failed to get user info' }, 500);
  }
});

// Get all bookings for a user
app.get('/make-server-6c7ad85d/bookings', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const role = await kv.get(`user:${user.id}:role`) || 'user';
    
    // Admin can see all bookings, regular users only see their own
    const bookingsData = await kv.getByPrefix('booking:');
    
    // Handle empty bookings
    if (!bookingsData || bookingsData.length === 0) {
      return c.json({ bookings: [] });
    }
    
    const allBookings = bookingsData.map(item => {
      try {
        return JSON.parse(item.value);
      } catch (parseError) {
        console.log(`Error parsing booking ${item.key}: ${parseError}`);
        return null;
      }
    }).filter(b => b !== null);
    
    const filteredBookings = role === 'admin' 
      ? allBookings 
      : allBookings.filter(b => b.userId === user.id);

    return c.json({ bookings: filteredBookings });
  } catch (error) {
    console.log(`Get bookings error: ${error}`);
    return c.json({ error: 'Failed to get bookings' }, 500);
  }
});

// Create a booking
app.post('/make-server-6c7ad85d/bookings', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { service, date, timeSlot } = await c.req.json();

    const bookingId = crypto.randomUUID();
    const booking = {
      id: bookingId,
      userId: user.id,
      service,
      date,
      timeSlot,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    await kv.set(`booking:${bookingId}`, JSON.stringify(booking));

    return c.json({ booking });
  } catch (error) {
    console.log(`Create booking error: ${error}`);
    return c.json({ error: 'Failed to create booking' }, 500);
  }
});

// Update booking status (admin only)
app.patch('/make-server-6c7ad85d/bookings/:id/status', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const role = await kv.get(`user:${user.id}:role`);
    
    if (role !== 'admin') {
      return c.json({ error: 'Forbidden - Admin only' }, 403);
    }

    const bookingId = c.req.param('id');
    const { status } = await c.req.json();

    const bookingKey = `booking:${bookingId}`;
    const bookingData = await kv.get(bookingKey);

    if (!bookingData) {
      return c.json({ error: 'Booking not found' }, 404);
    }

    const booking = JSON.parse(bookingData);
    booking.status = status;

    await kv.set(bookingKey, JSON.stringify(booking));

    return c.json({ booking });
  } catch (error) {
    console.log(`Update booking status error: ${error}`);
    return c.json({ error: 'Failed to update booking status' }, 500);
  }
});

// Update user profile
app.patch('/make-server-6c7ad85d/user/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { name } = await c.req.json();

    const { data, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { user_metadata: { name } }
    );

    if (updateError) {
      console.log(`Update profile error: ${updateError.message}`);
      return c.json({ error: updateError.message }, 400);
    }

    return c.json({ 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name
      }
    });
  } catch (error) {
    console.log(`Update profile error: ${error}`);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Get all users (admin only)
app.get('/make-server-6c7ad85d/users', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const role = await kv.get(`user:${user.id}:role`) || 'user';
    
    if (role !== 'admin') {
      return c.json({ error: 'Forbidden - Admin only' }, 403);
    }

    // Get all users from Supabase Auth
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.log(`Get users error: ${usersError.message}`);
      return c.json({ error: usersError.message }, 400);
    }

    // Get roles for all users
    const usersWithRoles = await Promise.all(
      users.map(async (u) => {
        const userRole = await kv.get(`user:${u.id}:role`) || 'user';
        return {
          id: u.id,
          email: u.email,
          name: u.user_metadata?.name || 'Unknown',
          role: userRole,
          createdAt: u.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
        };
      })
    );

    return c.json({ users: usersWithRoles });
  } catch (error) {
    console.log(`Get all users error: ${error}`);
    return c.json({ error: 'Failed to get users' }, 500);
  }
});

// Get all users - Public endpoint for demo admins (uses service role key)
app.get('/make-server-6c7ad85d/users/all', async (c) => {
  try {
    console.log('Fetching all users from Supabase...');
    
    // Get all users from Supabase Auth using service role
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.log(`Get all users error: ${usersError.message}`);
      return c.json({ error: usersError.message }, 400);
    }

    console.log(`Found ${users.length} users in Supabase`);

    // Get roles for all users
    const usersWithRoles = await Promise.all(
      users.map(async (u) => {
        const userRole = await kv.get(`user:${u.id}:role`) || 'user';
        return {
          id: u.id,
          email: u.email,
          name: u.user_metadata?.name || 'Unknown',
          role: userRole,
          createdAt: u.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
        };
      })
    );

    return c.json({ users: usersWithRoles });
  } catch (error) {
    console.log(`Get all users error: ${error}`);
    return c.json({ error: 'Failed to get users' }, 500);
  }
});

console.log('✅ Server configured successfully');
console.log('📍 Available routes:');
console.log('  - GET  /make-server-6c7ad85d/health');
console.log('  - POST /make-server-6c7ad85d/signup');
console.log('  - GET  /make-server-6c7ad85d/user');
console.log('  - GET  /make-server-6c7ad85d/bookings');
console.log('  - POST /make-server-6c7ad85d/bookings');
console.log('  - PATCH /make-server-6c7ad85d/bookings/:id/status');
console.log('  - PATCH /make-server-6c7ad85d/user/profile');
console.log('  - GET  /make-server-6c7ad85d/users');
console.log('  - GET  /make-server-6c7ad85d/users/all');
console.log('🎯 Starting Deno server...');

Deno.serve(app.fetch);