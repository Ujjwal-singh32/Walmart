"use client";

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function AddProductPage() {
  const [form, setForm] = useState({
    productId: uuidv4(),
    name: '',
    description: '',
    isOrganic: false,
    tags: '',
    additionalTags: '',
    basePrice: '',
    images: [],
    variety: [{ name: '', price: '', stock: '', unit: '' }],
    details: [{ title: '', value: '' }],
    sustainableScore: 0,
    energyUsed: 0,
    emissions: 0,
    greenPoints: 0,
    waterSaved: 0,
    plasticAvoided: 0,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'isOrganic') {
      if (!checked) {
        setForm((prev) => ({
          ...prev,
          isOrganic: false,
          sustainableScore: 0,
          energyUsed: 0,
          emissions: 0,
          greenPoints: 0,
          waterSaved: 0,
          plasticAvoided: 0,
        }));
        return;
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleDetailChange = (idx, field, value) => {
    const updated = [...form.details];
    updated[idx][field] = value;
    setForm({ ...form, details: updated });
  };

  const handleVarietyChange = (idx, field, value) => {
    const updated = [...form.variety];
    updated[idx][field] = value;
    setForm({ ...form, variety: updated });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, images: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.basePrice) {
      alert('Please fill in name, description, and base price.');
      return;
    }

    const formData = new FormData();
    formData.append('productId', form.productId);
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('isOrganic', form.isOrganic);
    formData.append('tags', JSON.stringify((form.tags + ',' + form.additionalTags).split(',').map(tag => tag.trim())));
    formData.append('basePrice', form.basePrice);
    formData.append('sustainableScore', form.sustainableScore);
    formData.append('energyUsed', form.energyUsed);
    formData.append('emissions', form.emissions);
    formData.append('greenPoints', form.greenPoints);
    formData.append('waterSaved', form.waterSaved);
    formData.append('plasticAvoided', form.plasticAvoided);

    form.details.forEach((detail, idx) => {
      formData.append(`details[${idx}]`, JSON.stringify(detail));
    });
    form.variety.forEach((v, idx) => {
      formData.append(`variety[${idx}]`, JSON.stringify(v));
    });
    form.images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const res = await fetch('/api/add-product', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        alert('Product added successfully!');
      } else {
        alert('Failed to add product: ' + result.error);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar />
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-1">Add New Product</h2>
          <p className="text-sm text-gray-500 mb-4">Fill in the details below to list your product on Amazon</p>

          <div className="space-y-4">
            <input name="productId" type="text" className="w-full border p-2 rounded" value={form.productId} readOnly />
            <input name="name" type="text" placeholder="Product Name" className="w-full border p-2 rounded" value={form.name} onChange={handleChange} required />
            <textarea name="description" placeholder="Description" className="w-full border p-2 rounded" value={form.description} onChange={handleChange} required />
            <input name="basePrice" type="number" step="0.01" placeholder="Base Price ($)" className="w-full border p-2 rounded" value={form.basePrice} onChange={handleChange} required />
            <input name="tags" type="text" placeholder="Primary Tags (comma separated)" className="w-full border p-2 rounded" value={form.tags} onChange={handleChange} />
            <input name="additionalTags" type="text" placeholder="Additional Tags (comma separated)" className="w-full border p-2 rounded" value={form.additionalTags} onChange={handleChange} />
            <label className="inline-flex items-center space-x-2">
              <input name="isOrganic" type="checkbox" checked={form.isOrganic} onChange={handleChange} />
              <span>Organic Product</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-medium mb-3">Product Images</h3>
          <input type="file" multiple onChange={handleFileChange} className="w-full border p-2 rounded" />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-medium mb-3">Varieties</h3>
          {form.variety.map((v, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-4 mb-4">
              <input type="text" placeholder="Name" value={v.name} onChange={(e) => handleVarietyChange(idx, 'name', e.target.value)} className="p-2 border rounded" />
              <input type="number" placeholder="Price" value={v.price} onChange={(e) => handleVarietyChange(idx, 'price', e.target.value)} className="p-2 border rounded" />
              <input type="number" placeholder="Stock" value={v.stock} onChange={(e) => handleVarietyChange(idx, 'stock', e.target.value)} className="p-2 border rounded" />
              <input type="text" placeholder="Unit" value={v.unit} onChange={(e) => handleVarietyChange(idx, 'unit', e.target.value)} className="p-2 border rounded" />
            </div>
          ))}
          <button type="button" onClick={() => setForm({ ...form, variety: [...form.variety, { name: '', price: '', stock: '', unit: '' }] })} className="bg-orange-500 text-white px-4 py-2 rounded">+ Add Variety</button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-medium mb-3">Product Details</h3>
          {form.details.map((d, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Title" value={d.title} onChange={(e) => handleDetailChange(idx, 'title', e.target.value)} className="p-2 border rounded" />
              <input type="text" placeholder="Value" value={d.value} onChange={(e) => handleDetailChange(idx, 'value', e.target.value)} className="p-2 border rounded" />
            </div>
          ))}
          <button type="button" onClick={() => setForm({ ...form, details: [...form.details, { title: '', value: '' }] })} className="bg-orange-500 text-white px-4 py-2 rounded">+ Add Detail</button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-medium mb-3">Sustainability Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <input name="sustainableScore" disabled={!form.isOrganic} type="number" placeholder="Sustainable Score" className="w-full border p-2 rounded" value={form.sustainableScore} onChange={handleChange} />
            <input name="energyUsed" disabled={!form.isOrganic} type="number" placeholder="Energy Used" className="w-full border p-2 rounded" value={form.energyUsed} onChange={handleChange} />
            <input name="emissions" disabled={!form.isOrganic} type="number" placeholder="Emissions" className="w-full border p-2 rounded" value={form.emissions} onChange={handleChange} />
            <input name="greenPoints" disabled={!form.isOrganic} type="number" placeholder="Green Points" className="w-full border p-2 rounded" value={form.greenPoints} onChange={handleChange} />
            <input name="waterSaved" disabled={!form.isOrganic} type="number" placeholder="Water Saved" className="w-full border p-2 rounded" value={form.waterSaved} onChange={handleChange} />
            <input name="plasticAvoided" disabled={!form.isOrganic} type="number" placeholder="Plastic Avoided" className="w-full border p-2 rounded" value={form.plasticAvoided} onChange={handleChange} />
          </div>
        </div>

        <div className="text-right">
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Publish Product</button>
        </div>
      </form>
      <Footer/>
    </div>
  );
}
