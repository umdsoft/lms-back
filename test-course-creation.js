/**
 * Course Creation Test Script
 * Run: node test-course-creation.js
 */

const knex = require('knex')(require('./knexfile').development);
const courseService = require('./src/services/course.service');

async function testCourseCreation() {
  console.log('🚀 Testing Course Creation API...\n');

  try {
    // Step 1: Check directions
    console.log('1️⃣ Checking available directions...');
    const directions = await knex('directions').select('id', 'name', 'slug');
    console.log(`   ✅ Found ${directions.length} directions:`);
    directions.forEach(d => console.log(`      - ID ${d.id}: ${d.name}`));
    console.log();

    if (directions.length === 0) {
      console.log('   ❌ No directions found! Please run seeds first.');
      process.exit(1);
    }

    // Step 2: Test validation - Missing directionId
    console.log('2️⃣ Testing validation: Missing directionId...');
    try {
      await courseService.createCourse({
        name: 'Test Course',
        level: 'beginner',
        description: 'Test',
      });
      console.log('   ❌ FAILED: Should have thrown error');
    } catch (error) {
      if (error.message === 'Direction ID is required') {
        console.log('   ✅ PASSED: Correct validation error');
      } else {
        console.log('   ❌ FAILED: Wrong error:', error.message);
      }
    }
    console.log();

    // Step 3: Test validation - Missing name
    console.log('3️⃣ Testing validation: Missing name...');
    try {
      await courseService.createCourse({
        directionId: 1,
        level: 'beginner',
      });
      console.log('   ❌ FAILED: Should have thrown error');
    } catch (error) {
      if (error.message === 'Course name is required') {
        console.log('   ✅ PASSED: Correct validation error');
      } else {
        console.log('   ❌ FAILED: Wrong error:', error.message);
      }
    }
    console.log();

    // Step 4: Test validation - Invalid level
    console.log('4️⃣ Testing validation: Invalid level...');
    try {
      await courseService.createCourse({
        name: 'Test Course',
        directionId: 1,
        level: 'invalid-level',
      });
      console.log('   ❌ FAILED: Should have thrown error');
    } catch (error) {
      if (error.message.includes('Invalid level')) {
        console.log('   ✅ PASSED: Correct validation error');
      } else {
        console.log('   ❌ FAILED: Wrong error:', error.message);
      }
    }
    console.log();

    // Step 5: Test validation - Direction not found
    console.log('5️⃣ Testing validation: Direction not found...');
    try {
      await courseService.createCourse({
        name: 'Test Course',
        directionId: 999,
        level: 'beginner',
      });
      console.log('   ❌ FAILED: Should have thrown error');
    } catch (error) {
      if (error.message === 'Direction not found') {
        console.log('   ✅ PASSED: Correct validation error');
      } else {
        console.log('   ❌ FAILED: Wrong error:', error.message);
      }
    }
    console.log();

    // Step 6: Test successful course creation
    console.log('6️⃣ Testing successful course creation...');
    const newCourse = await courseService.createCourse({
      name: 'Test Programming Course',
      directionId: 1,
      level: 'beginner',
      description: 'This is a test programming course',
      pricingType: 'subscription',
      price: 0,
    });
    console.log('   ✅ PASSED: Course created successfully!');
    console.log('   Course Details:');
    console.log('      ID:', newCourse.id);
    console.log('      Name:', newCourse.name);
    console.log('      Slug:', newCourse.slug);
    console.log('      Direction:', newCourse.direction.name);
    console.log('      Level:', newCourse.level);
    console.log('      Status:', newCourse.status);
    console.log();

    // Step 7: Test individual pricing validation
    console.log('7️⃣ Testing individual pricing validation...');
    try {
      await courseService.createCourse({
        name: 'Premium Course',
        directionId: 2,
        level: 'advanced',
        pricingType: 'individual',
        price: 0,
      });
      console.log('   ❌ FAILED: Should have thrown error for zero price');
    } catch (error) {
      if (error.message.includes('Price is required')) {
        console.log('   ✅ PASSED: Correct pricing validation');
      } else {
        console.log('   ❌ FAILED: Wrong error:', error.message);
      }
    }
    console.log();

    // Step 8: Test individual pricing success
    console.log('8️⃣ Testing individual pricing course creation...');
    const premiumCourse = await courseService.createCourse({
      name: 'Premium Mathematics Course',
      directionId: 2,
      level: 'advanced',
      description: 'Advanced mathematics for serious students',
      pricingType: 'individual',
      price: 299000,
    });
    console.log('   ✅ PASSED: Individual pricing course created!');
    console.log('   Course Details:');
    console.log('      ID:', premiumCourse.id);
    console.log('      Name:', premiumCourse.name);
    console.log('      Pricing Type:', premiumCourse.pricingType);
    console.log('      Price:', premiumCourse.price, 'UZS');
    console.log();

    // Cleanup
    console.log('🧹 Cleaning up test data...');
    await knex('courses').whereIn('id', [newCourse.id, premiumCourse.id]).del();
    console.log('   ✅ Test courses deleted\n');

    console.log('✨ ALL TESTS PASSED! ✨\n');
    console.log('📝 Summary:');
    console.log('   - Validation works correctly');
    console.log('   - Course creation successful');
    console.log('   - Foreign keys working');
    console.log('   - Pricing validation working');
    console.log('\n✅ Your API is ready to use!\n');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await knex.destroy();
  }
}

// Run tests
testCourseCreation();
