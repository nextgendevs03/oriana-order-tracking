/**
 * Seed Admin User Script
 *
 * This script creates the first admin user in the production database.
 * It sets up:
 *   1. First admin user (without role initially)
 *   2. All permissions (with admin user as creator)
 *   3. Admin role with all permissions
 *   4. Updates admin user with the admin role
 *
 * Usage:
 *   Set DATABASE_URL environment variable and run:
 *   node scripts/seed-admin.js
 *
 *   Or for production (fetches credentials from AWS Secrets Manager):
 *   AWS_REGION=ap-south-1 DB_SECRET_ID=/oriana/prod/db DB_HOST=your-rds-host node scripts/seed-admin.js
 *
 * Default admin credentials (CHANGE AFTER FIRST LOGIN!):
 *   Username: admin
 *   Password: admin
 */

const bcrypt = require("bcryptjs");

// Configuration
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@oriana.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

// Permissions to seed
const PERMISSIONS = [
  // Product Management
  { code: "product_create", name: "Product Management Create", description: "Permission to create products, OEM, Category, Client" },
  { code: "product_read", name: "Product Management Read", description: "Permission to Read products, OEM, Category, Client" },
  { code: "product_update", name: "Product Management Update", description: "Permission to Update products, OEM, Category, Client" },
  { code: "product_delete", name: "Product Management Delete", description: "Permission to Delete products, OEM, Category, Client" },
  // Users Management
  { code: "users_create", name: "Users management Create", description: "Permission to Create users, roles and permissions" },
  { code: "users_read", name: "Users management Read", description: "Permission to Read users, roles and permissions" },
  { code: "users_update", name: "Users management Update", description: "Permission to Update users, roles and permissions" },
  { code: "users_delete", name: "Users management Delete", description: "Permission to Delete users, roles and permissions" },
  { code: "users_view", name: "Users management View", description: "Permission to View users, roles and permissions" },
  // PO Management
  { code: "po_create", name: "PO management Create", description: "Permission to Create POs" },
  { code: "po_read", name: "PO management Read", description: "Permission to Read POs" },
  { code: "po_update", name: "PO management Update", description: "Permission to Update POs" },
  { code: "po_delete", name: "PO management Delete", description: "Permission to Delete POs" },
  // Dispatch Management
  { code: "dispatch_create", name: "Dispatch management Create", description: "Permission to Create Dispatches, Delivery and documents" },
  { code: "dispatch_read", name: "Dispatch management Read", description: "Permission to Read Dispatches, Delivery and documents" },
  { code: "dispatch_update", name: "Dispatch management Update", description: "Permission to Update Dispatches, Delivery and documents" },
  { code: "dispatch_delete", name: "Dispatch management Delete", description: "Permission to Delete Dispatches, Delivery and documents" },
  // Commissioning Management
  { code: "commissioning_create", name: "Commissioning management Create", description: "Permission to Create Pre-Commissioning, Commissioning, and Warranty" },
  { code: "commissioning_read", name: "Commissioning management Read", description: "Permission to Read Pre-Commissioning, Commissioning, and Warranty" },
  { code: "commissioning_update", name: "Commissioning management Update", description: "Permission to Update Pre-Commissioning, Commissioning, and Warranty" },
  { code: "commissioning_delete", name: "Commissioning management Delete", description: "Permission to Delete Pre-Commissioning, Commissioning, and Warranty" },
];

async function getDbConnection() {
  // Check if DATABASE_URL is provided directly
  if (process.env.DATABASE_URL) {
    console.log("   Using DATABASE_URL from environment");
    return { 
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : {
        rejectUnauthorized: false,
      },
    };
  }

  // Otherwise, fetch from AWS Secrets Manager (for production)
  const {
    SecretsManagerClient,
    GetSecretValueCommand,
  } = require("@aws-sdk/client-secrets-manager");

  const region = process.env.AWS_REGION || "ap-south-1";
  const secretId = process.env.DB_SECRET_ID || "/oriana/prod/db";
  const dbHost = process.env.DB_HOST;
  const dbPort = process.env.DB_PORT || "5432";
  const dbName = process.env.DB_NAME || "oriana";

  if (!dbHost) {
    throw new Error(
      "DB_HOST is required when not using DATABASE_URL.\n" +
      "Either set DATABASE_URL or set DB_HOST along with DB_SECRET_ID."
    );
  }

  console.log(`   Fetching credentials from AWS Secrets Manager (${secretId})...`);
  const secretsClient = new SecretsManagerClient({ region });
  const secret = await secretsClient.send(
    new GetSecretValueCommand({ SecretId: secretId })
  );
  const credentials = JSON.parse(secret.SecretString);
  const { username, password } = credentials;

  console.log(`   Connecting to: ${dbHost}:${dbPort}/${dbName}`);

  // Return connection config object for pg library
  // AWS RDS requires SSL, so we configure it properly
  return {
    host: dbHost,
    port: parseInt(dbPort),
    database: dbName,
    user: username,
    password: password,
    ssl: {
      rejectUnauthorized: false, // Required for RDS since it uses self-signed certs
    },
    connectionTimeoutMillis: 30000, // 30 second timeout
  };
}

async function seedDatabase() {
  console.log("\n🌱 Starting admin seed...\n");

  // Get database connection config
  const dbConfig = await getDbConnection();

  // Dynamic import for pg (ESM compatible)
  const { Client } = require("pg");
  const client = new Client(dbConfig);

  try {
    console.log("   Attempting database connection...");
    await client.connect();
    console.log("   ✅ Connected to database\n");

    // Start transaction
    await client.query("BEGIN");

    // Step 1: Create admin user FIRST (without role initially)
    // This is needed because permissions and roles need created_by/updated_by
    console.log("👨‍💼 Step 1: Creating admin user (without role)...");
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Check if user already exists
    let adminUserId;
    const existingUser = await client.query(
      "SELECT user_id FROM users WHERE username = $1 OR email = $2",
      [ADMIN_USERNAME, ADMIN_EMAIL]
    );

    if (existingUser.rows.length > 0) {
      adminUserId = existingUser.rows[0].user_id;
      console.log(`   ⚠️  User '${ADMIN_USERNAME}' already exists with ID: ${adminUserId}`);
      // Update password
      await client.query(
        `UPDATE users SET
           password = $1,
           is_active = true,
           updated_by = $2,
           updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2`,
        [hashedPassword, adminUserId]
      );
    } else {
      const userResult = await client.query(
        `INSERT INTO users (username, email, password, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING user_id`,
        [ADMIN_USERNAME, ADMIN_EMAIL, hashedPassword]
      );
      adminUserId = userResult.rows[0].user_id;
      console.log(`   ✅ Admin user created with ID: ${adminUserId}`);
    }
    console.log("");

    // Step 2: Insert permissions (with admin user as creator)
    console.log("📋 Step 2: Seeding permissions...");
    for (const perm of PERMISSIONS) {
      await client.query(
        `INSERT INTO permissions (permission_code, permission_name, description, is_active, created_by, updated_by, created_at, updated_at)
         VALUES ($1, $2, $3, true, $4, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         ON CONFLICT (permission_code) DO UPDATE SET
           permission_name = EXCLUDED.permission_name,
           description = EXCLUDED.description,
           updated_by = $4,
           updated_at = CURRENT_TIMESTAMP`,
        [perm.code, perm.name, perm.description, adminUserId]
      );
    }
    console.log(`   ✅ Inserted/updated ${PERMISSIONS.length} permissions\n`);

    // Step 3: Create admin role (with admin user as creator)
    console.log("👤 Step 3: Creating admin role...");
    const roleResult = await client.query(
      `INSERT INTO roles (role_name, description, is_active, created_by, updated_by, created_at, updated_at)
       VALUES ('admin', 'Admin user will have all access to platform', true, $1, $1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (role_name) DO UPDATE SET
         description = EXCLUDED.description,
         is_active = true,
         updated_by = $1,
         updated_at = CURRENT_TIMESTAMP
       RETURNING role_id`,
      [adminUserId]
    );
    const adminRoleId = roleResult.rows[0].role_id;
    console.log(`   ✅ Admin role created/updated with ID: ${adminRoleId}\n`);

    // Step 4: Assign all permissions to admin role
    console.log("🔗 Step 4: Assigning permissions to admin role...");
    const permissionsResult = await client.query("SELECT permission_id FROM permissions");
    for (const row of permissionsResult.rows) {
      await client.query(
        `INSERT INTO role_permissions (role_id, permission_id, is_active, created_by, updated_by, created_at, updated_at)
         VALUES ($1, $2, true, $3, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         ON CONFLICT (role_id, permission_id) DO UPDATE SET
           is_active = true,
           updated_by = $3,
           updated_at = CURRENT_TIMESTAMP`,
        [adminRoleId, row.permission_id, adminUserId]
      );
    }
    console.log(`   ✅ Assigned ${permissionsResult.rows.length} permissions to admin role\n`);

    // Step 5: Update admin user with the admin role
    console.log("🔄 Step 5: Updating admin user with admin role...");
    await client.query(
      `UPDATE users SET
         role_id = $1,
         updated_by = $2,
         updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2`,
      [adminRoleId, adminUserId]
    );
    console.log(`   ✅ Admin user updated with role ID: ${adminRoleId}\n`);

    // Commit transaction
    await client.query("COMMIT");

    console.log("═".repeat(50));
    console.log("\n🎉 Admin seed completed successfully!\n");
    console.log("═".repeat(50));
    console.log("\n📝 Admin Credentials:");
    console.log(`   Username: ${ADMIN_USERNAME}`);
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log("\n⚠️  IMPORTANT: Change this password after first login!\n");

  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      // Ignore rollback error if connection already closed
    }
    console.error("\n❌ Seed failed:", error.message);
    
    // Provide helpful error messages
    if (error.message.includes("Connection terminated")) {
      console.error("\n💡 Hint: Connection terminated. This could mean:");
      console.error("   - RDS Security Group doesn't allow your IP");
      console.error("   - SSL configuration issue");
      console.error("   - Network connectivity problem");
      console.error("   - RDS instance is not running (check if it's stopped by scheduler)");
    } else if (error.message.includes("timeout")) {
      console.error("\n💡 Hint: Connection timeout. Check:");
      console.error("   - RDS Security Group allows inbound traffic on port 5432");
      console.error("   - RDS instance is publicly accessible");
    } else if (error.message.includes("password")) {
      console.error("\n💡 Hint: Authentication failed. Check:");
      console.error("   - Secrets Manager secret has correct username/password");
    }
    
    throw error;
  } finally {
    try {
      await client.end();
    } catch (endError) {
      // Ignore if already closed
    }
  }
}

// Run the seed
seedDatabase().catch((error) => {
  console.error(error);
  process.exit(1);
});
