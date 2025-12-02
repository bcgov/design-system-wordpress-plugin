<?php

/**
 * Class PluginInitializationTest
 *
 * @package WordPress_Search
 */
class PluginInitializationTest extends WP_UnitTestCase {
	/**
     * Tests if the plugin is properly loaded and activated.

     * A simple test to verify WordPress test environment is working
     */
    public function test_wordpress_environment() {
        // Check if WordPress is loaded.
        $this->assertTrue( defined( 'ABSPATH' ), 'WordPress should be loaded' );

        // Create a test post with specific content.
        $post_title   = 'Test Post ' . time(); // Add timestamp to make it unique.
        $post_content = 'This is test content created at ';

        $post_id = wp_insert_post(
            [
				'post_title'   => $post_title,
				'post_content' => $post_content,
				'post_status'  => 'publish',
			]
        );

        // Verify post was created successfully.
        $this->assertNotFalse( $post_id, 'Should be able to create a post' );
        $this->assertIsInt( $post_id, 'Post ID should be an integer' );

        // Verify we can retrieve the post.
        $post = get_post( $post_id );
        $this->assertNotNull( $post, 'Should be able to retrieve the post' );
        $this->assertEquals( $post_title, $post->post_title, 'Post title should match what we set' );
        $this->assertEquals( $post_content, $post->post_content, 'Post content should match what we set' );

        // Verify post exists in database.
        $existing_post_id = post_exists( $post_title );
        $this->assertNotFalse( $existing_post_id, 'Post should exist in database' );
        $this->assertEquals( $post_id, $existing_post_id, 'Found post ID should match created post ID' );

        // Clean up.
        $deleted = wp_delete_post( $post_id, true );
        $this->assertNotFalse( $deleted, 'Should be able to delete the post' );

        // Verify post is actually deleted.
        $this->assertEquals( 0, post_exists( $post_title ), 'Post should be deleted from database' );
    }
}