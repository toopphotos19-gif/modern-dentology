npx vercel env rm DATABASE_URL production -y || true
echo "postgresql://neondb_owner:npg_8lBI3KHWkucz@ep-polished-credit-ahqjet9s-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" | npx vercel env add DATABASE_URL production

npx vercel env rm NEXTAUTH_SECRET production -y || true
echo "jG65G1ExppdFj7JXteq0PW+l6yfcaqqDCb9DZv/YNF4=" | npx vercel env add NEXTAUTH_SECRET production

npx vercel env rm NEXTAUTH_URL production -y || true
echo "https://modern-dentology.vercel.app" | npx vercel env add NEXTAUTH_URL production

npx vercel env rm CLOUDINARY_CLOUD_NAME production -y || true
echo "dtq4ys1us" | npx vercel env add CLOUDINARY_CLOUD_NAME production

npx vercel env rm CLOUDINARY_API_KEY production -y || true
echo "827784364477753" | npx vercel env add CLOUDINARY_API_KEY production

npx vercel env rm CLOUDINARY_API_SECRET production -y || true
echo "_qgktbWzShJnJpGbvGv9kOpYu_k" | npx vercel env add CLOUDINARY_API_SECRET production

npx vercel env rm CLOUDINARY_URL production -y || true
echo "cloudinary://827784364477753:_qgktbWzShJnJpGbvGv9kOpYu_k@dtq4ys1us" | npx vercel env add CLOUDINARY_URL production

npx vercel env rm NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME production -y || true
echo "dtq4ys1us" | npx vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME production

echo "Starting deployment..."
npx vercel --prod --yes
