/**
 * Test Script for Transaction History System
 * Run this after starting the backend server to test the new features
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:6700/api';

// Test credentials (update with your actual test users)
const testUsers = {
    admin: {
        email: 'admin@test.com',
        password: 'admin123'
    },
    manager: {
        email: 'manager@test.com',
        password: 'manager123'
    },
    user: {
        email: 'user@test.com',
        password: 'user123'
    }
};

let tokens = {};

async function login(role) {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, testUsers[role]);
        tokens[role] = response.data.token;
        console.log(`✅ ${role.toUpperCase()} logged in successfully`);
        return response.data.token;
    } catch (error) {
        console.error(`❌ ${role.toUpperCase()} login failed:`, error.response?.data?.message || error.message);
    }
}

async function testGetTransactions(role) {
    try {
        const response = await axios.get(`${BASE_URL}/transactions`, {
            headers: { Authorization: `Bearer ${tokens[role]}` }
        });
        console.log(`✅ ${role.toUpperCase()} - Fetched ${response.data.transactions.length} transactions`);
        console.log(`   Total: ${response.data.pagination.totalTransactions}`);
        return response.data;
    } catch (error) {
        console.error(`❌ ${role.toUpperCase()} - Failed to fetch transactions:`, error.response?.data?.message || error.message);
    }
}

async function testGetAnalytics() {
    try {
        const response = await axios.get(`${BASE_URL}/transactions/analytics`, {
            headers: { Authorization: `Bearer ${tokens.admin}` }
        });
        console.log(`✅ ADMIN - Analytics fetched successfully`);
        console.log(`   Total Transactions: ${response.data.totalTransactions}`);
        console.log(`   Total Revenue: ₹${response.data.totalRevenue}`);
        return response.data;
    } catch (error) {
        console.error(`❌ ADMIN - Failed to fetch analytics:`, error.response?.data?.message || error.message);
    }
}

async function testCreateTransaction() {
    try {
        const response = await axios.post(`${BASE_URL}/transactions`, {
            type: 'sale',
            amount: 5000,
            description: 'Test sale transaction',
            status: 'completed',
            metadata: {
                paymentMethod: 'UPI',
                notes: 'Automated test transaction'
            }
        }, {
            headers: { Authorization: `Bearer ${tokens.admin}` }
        });
        console.log(`✅ ADMIN - Created test transaction: ${response.data._id}`);
        return response.data;
    } catch (error) {
        console.error(`❌ ADMIN - Failed to create transaction:`, error.response?.data?.message || error.message);
    }
}

async function testFiltering() {
    try {
        const response = await axios.get(`${BASE_URL}/transactions?type=order&status=completed&limit=5`, {
            headers: { Authorization: `Bearer ${tokens.admin}` }
        });
        console.log(`✅ ADMIN - Filtering works (type=order, status=completed)`);
        console.log(`   Found ${response.data.transactions.length} transactions`);
        return response.data;
    } catch (error) {
        console.error(`❌ ADMIN - Filtering test failed:`, error.response?.data?.message || error.message);
    }
}

async function runTests() {
    console.log('\n🚀 Starting Transaction History System Tests...\n');
    console.log('='.repeat(60));

    // Step 1: Login all users
    console.log('\n📝 STEP 1: Logging in test users...\n');
    await login('admin');
    await login('manager');
    await login('user');

    // Step 2: Test fetching transactions with different roles
    console.log('\n📝 STEP 2: Testing role-based transaction viewing...\n');
    await testGetTransactions('admin');
    await testGetTransactions('manager');
    await testGetTransactions('user');

    // Step 3: Test analytics (admin only)
    console.log('\n📝 STEP 3: Testing analytics (Admin only)...\n');
    await testGetAnalytics();

    // Step 4: Test creating a transaction
    console.log('\n📝 STEP 4: Testing transaction creation...\n');
    await testCreateTransaction();

    // Step 5: Test filtering
    console.log('\n📝 STEP 5: Testing filtering...\n');
    await testFiltering();

    console.log('\n' + '='.repeat(60));
    console.log('\n✨ All tests completed!\n');
    console.log('💡 TIP: Check the frontend at http://localhost:5173/transactions\n');
}

// Run the tests
runTests().catch(err => {
    console.error('\n❌ Test suite failed:', err.message);
    process.exit(1);
});
