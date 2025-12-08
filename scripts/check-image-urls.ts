import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || '';

const ProjectSchema = new mongoose.Schema({}, { strict: false });
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

async function checkUrls() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB\n');

        const projects = await Project.find({}).limit(5);

        console.log('Sample Project Image URLs:\n');
        projects.forEach((project: any) => {
            console.log(`Project: ${project.title}`);
            console.log(`Image: ${project.image}`);
            if (project.gallery && project.gallery.length > 0) {
                console.log(`Gallery: ${project.gallery[0]}`);
            }
            console.log('---\n');
        });

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkUrls();
