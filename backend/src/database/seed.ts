import { query } from './connection.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const seedDatabase = async (): Promise<void> => {
  try {
    // Clear existing data
    await query('TRUNCATE users, communities, community_members, projects, user_follows CASCADE');

    // Create test users
    const users = [
      {
        id: uuidv4(),
        email: 'andrew@example.com',
        username: 'andrew',
        fullName: 'Andrew Kim',
        role: 'admin',
        isVerified: true,
      },
      {
        id: uuidv4(),
        email: 'charles@example.com',
        username: 'charles',
        fullName: 'Charles Mbugua',
        role: 'moderator',
        isVerified: true,
      },
      {
        id: uuidv4(),
        email: 'festus@example.com',
        username: 'festuspro',
        fullName: 'Festus Pro',
        role: 'user',
        isVerified: true,
      },
      {
        id: uuidv4(),
        email: 'sharon@example.com',
        username: 'sharonmurugi',
        fullName: 'Sharon Murugi',
        role: 'user',
        isVerified: true,
      },
      {
        id: uuidv4(),
        email: 'sidney@example.com',
        username: 'mathncode',
        fullName: 'Sidney Baraka',
        role: 'moderator',
        isVerified: true,
      },
      {
        id: uuidv4(),
        email: 'steve@example.com',
        username: 'stevo',
        fullName: 'Steve Kingoro',
        role: 'user',
        isVerified: true,
      },
    ];

    // Hash passwords and insert users
    const hashedPassword = await bcrypt.hash('password123', 10);
    for (const user of users) {
      await query(
        `INSERT INTO users (id, email, password, username, full_name, role, is_verified, 
         avatar_url, bio, location) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          user.id,
          user.email,
          hashedPassword,
          user.username,
          user.fullName,
          user.role,
          user.isVerified,
          `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 100)}`,
          `I'm a passionate developer`,
          'Remote',
        ]
      );
    }

    // Create communities
    const adminUser = users[0];
    const communities = [
      {
        id: uuidv4(),
        name: 'Andi - "NauraNat"',
        slug: 'nau-ranat',
        description: 'Technical Lead at Salamander',
        owner_id: adminUser.id,
      },
      {
        id: uuidv4(),
        name: 'Trendi: New Quantum',
        slug: 'trendi-quantum',
        description: 'Exploring the future of computing',
        owner_id: adminUser.id,
      },
      {
        id: uuidv4(),
        name: 'Python X',
        slug: 'python-x',
        description: 'Python for AI and Data Science',
        owner_id: adminUser.id,
      },
      {
        id: uuidv4(),
        name: 'BlueStack X',
        slug: 'bluestack-x',
        description: 'Next-gen cloud infrastructure',
        owner_id: adminUser.id,
      },
    ];

    for (const community of communities) {
      await query(
        `INSERT INTO communities (id, name, slug, description, owner_id, member_count, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          community.id,
          community.name,
          community.slug,
          community.description,
          community.owner_id,
          Math.floor(Math.random() * 5000) + 100,
          `https://picsum.photos/seed/${community.slug}/400/200`,
        ]
      );
    }

    // Add members to communities
    for (const community of communities) {
      for (const user of users) {
        await query(
          `INSERT INTO community_members (community_id, user_id, role)
           VALUES ($1, $2, $3)`,
          [
            community.id,
            user.id,
            user.id === community.owner_id ? 'owner' : 'member',
          ]
        );
      }
    }

    // Create user follows
    for (let i = 1; i < users.length; i++) {
      await query(
        `INSERT INTO user_follows (follower_id, following_id)
         VALUES ($1, $2)`,
        [users[i].id, users[0].id]
      );
    }

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default seedDatabase;
