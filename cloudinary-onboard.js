const cloudinary = require('cloudinary').v2;

(async function() {
    // Configure Cloudinary with real credentials
    cloudinary.config({ 
        cloud_name: 'dtq4ys1us', 
        api_key: '827784364477753', 
        api_secret: '_qgktbWzShJnJpGbvGv9kOpYu_k'
    });
    
    console.log('🚀 Starting Cloudinary integration test...\n');
    
    // Upload an image
    console.log('📤 Uploading image...');
    const uploadResult = await cloudinary.uploader
        .upload(
            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
            { public_id: 'shoes' }
        )
        .catch((error) => {
            console.error('❌ Upload failed:', error);
            process.exit(1);
        });
    
    console.log(`✅ Image uploaded successfully!`);
    console.log(`   Secure URL: ${uploadResult.secure_url}`);
    console.log(`   Public ID: ${uploadResult.public_id}\n`);
    
    // Get image details
    console.log('📊 Fetching image metadata...');
    const resourceDetails = await cloudinary.api.resource(uploadResult.public_id);
    console.log(`✅ Image metadata:`);
    console.log(`   Width: ${resourceDetails.width}px`);
    console.log(`   Height: ${resourceDetails.height}px`);
    console.log(`   Format: ${resourceDetails.format}`);
    console.log(`   Size: ${resourceDetails.bytes} bytes\n`);
    
    // Transform the image with automatic format and quality
    // f_auto = automatic format selection (WebP, AVIF, etc. based on browser support)
    // q_auto = automatic quality (optimal quality-to-file-size ratio)
    console.log('🎨 Generating optimized image URL...');
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
        fetch_format: 'auto',  // Automatically select best format
        quality: 'auto'        // Automatically optimize quality
    });
    
    console.log(`✅ Done! Click link below to see optimized version of the image. Check the size and the format.`);
    console.log(`   Transformed URL: ${transformedUrl}\n`);
    
    console.log('🎉 Cloudinary integration successful!');
})();
