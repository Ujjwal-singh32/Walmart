import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import formidable from 'formidable';
import Product from '@/models/productModel';
import connectDB from '@/lib/db';
import { Readable } from 'stream';

// Disable Next.js body parsing
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(request) {
    await connectDB();

    const req = await toNodeReadable(request);

    const form = formidable({ multiples: true });

    // 🛠️ Attach required headers manually
    req.headers = {
        'content-type': request.headers.get('content-type') || '',
        'content-length': request.headers.get('content-length') || '',
    };

    const data = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err);
            resolve({ fields, files });
        });
    });

    try {
        const {
            productId,
            name,
            description,
            isOrganic,
            tags,
            variety,
            details,
            basePrice,
            sustainableScore,
            energyUsed,
            emissions,
            greenPoints,
            waterSaved,
            plasticAvoided,
        } = data.fields;

        const uploadedImages = [];
        const images = Array.isArray(data.files.images)
            ? data.files.images
            : [data.files.images];

        for (const file of images) {
            if (!file || !file.filepath) continue;
            const result = await cloudinary.uploader.upload(file.filepath, {
                folder: 'products',
            });
            uploadedImages.push(result.secure_url);
        }

        const getField = (field) =>
            Array.isArray(field) ? field[0] : field ?? '';

        function collectArrayFields(fields, prefix) {
            return Object.keys(fields)
                .filter(key => key.startsWith(prefix + '['))
                .sort()
                .map(key => {
                    const val = fields[key];
                    return JSON.parse(Array.isArray(val) ? val[0] : val); // ⬅ remove extra wrapping
                });
        }


        // Then:
        const newProduct = new Product({
            productId: getField(productId),
            name: getField(name),
            description: getField(description),
            isOrganic: getField(isOrganic) === 'true',
            tags: JSON.parse(getField(tags) || '[]'),
            images: uploadedImages,
            variety: collectArrayFields(data.fields, 'variety'),
            details: collectArrayFields(data.fields, 'details'),
            basePrice: parseFloat(getField(basePrice)),
            sustainableScore: parseFloat(getField(sustainableScore)),
            energyUsed: parseFloat(getField(energyUsed)),
            emissions: parseFloat(getField(emissions)),
            greenPoints: parseFloat(getField(greenPoints)),
            waterSaved: parseFloat(getField(waterSaved)),
            plasticAvoided: parseFloat(getField(plasticAvoided)),
        });



        await newProduct.save();

        return NextResponse.json({ success: true, product: newProduct }, { status: 201 });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// 🔁 Convert Request body to Node-compatible stream and manually attach headers
async function toNodeReadable(request) {
    const reader = request.body.getReader();
    const stream = Readable.from((async function* () {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            yield value;
        }
    })());

    stream.headers = {
        'content-type': request.headers.get('content-type') || '',
        'content-length': request.headers.get('content-length') || '',
    };

    return stream;
}
