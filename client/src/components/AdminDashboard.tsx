import React, { useEffect, useState } from 'react';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../api';
import { Plus, Search, Edit2, Trash2, LogOut, X } from 'lucide-react';

interface EventData {
    _id?: string;
    title: string;
    category: string;
    location: string;
    price: string;
    date: string;
    imageUrl: string;
    description: string;
}

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [events, setEvents] = useState<EventData[]>([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
    const [formData, setFormData] = useState<EventData>({
        title: '', category: '', location: '', price: '', date: '', imageUrl: '', description: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        loadEvents();
    }, [search]);

    const loadEvents = async () => {
        try {
            const res = await fetchEvents({ search });
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const validate = () => {
        let tempErrors: any = {};
        if (!formData.title) tempErrors.title = "Title is required";
        if (!formData.category) tempErrors.category = "Category is required";
        if (!formData.location) tempErrors.location = "Location is required";
        if (!formData.price || isNaN(Number(formData.price))) tempErrors.price = "Valid price is required";
        if (!formData.date) tempErrors.date = "Date is required";
        if (!formData.imageUrl && !imageFile) tempErrors.imageUrl = "Image URL or File is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) data.append(key, value);
        });
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            if (editingEvent) {
                await updateEvent(editingEvent._id!, data);
            } else {
                await createEvent(data);
            }
            setShowModal(false);
            setEditingEvent(null);
            setFormData({ title: '', category: '', location: '', price: '', date: '', imageUrl: '', description: '' });
            setImageFile(null);
            loadEvents();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await deleteEvent(id);
                loadEvents();
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    const handleEdit = (event: EventData) => {
        setEditingEvent(event);
        setFormData({ ...event, date: new Date(event.date).toISOString().split('T')[0] });
        setShowModal(true);
    };

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ color: 'var(--primary)', fontSize: '32px' }}>BookMyShow <span style={{ color: 'var(--text-main)', fontWeight: '300' }}>Admin</span></h1>
                </div>
                <button onClick={onLogout} className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LogOut size={18} /> Logout
                </button>
            </header>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <p style={{ color: 'var(--text-grey)', fontSize: '14px' }}>Total Events</p>
                    <h2 style={{ fontSize: '28px' }}>{events.length}</h2>
                </div>
                <div className="stat-card" style={{ borderLeftColor: 'var(--success)' }}>
                    <p style={{ color: 'var(--text-grey)', fontSize: '14px' }}>Revenue (Total)</p>
                    <h2 style={{ fontSize: '28px' }}>₹{events.reduce((acc, ev) => acc + Number(ev.price), 0)}</h2>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-grey)' }} size={20} />
                    <input
                        className="search-bar"
                        style={{ paddingLeft: '45px', marginBottom: 0 }}
                        placeholder="Search events by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button onClick={() => { setEditingEvent(null); setFormData({ title: '', category: '', location: '', price: '', date: '', imageUrl: '', description: '' }); setShowModal(true); }} className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={20} /> Add New Event
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Event Title</th>
                            <th>Category</th>
                            <th>Location</th>
                            <th>Price</th>
                            <th>Date</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event._id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img src={event.imageUrl} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                                        <span style={{ fontWeight: '600' }}>{event.title}</span>
                                    </div>
                                </td>
                                <td><span style={{ background: 'var(--bg-main)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{event.category}</span></td>
                                <td>{event.location}</td>
                                <td style={{ color: 'var(--success)', fontWeight: 'bold' }}>₹{event.price}</td>
                                <td>{new Date(event.date).toLocaleDateString()}</td>
                                <td>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                        <button onClick={() => handleEdit(event)} style={{ background: 'none', color: 'var(--secondary)' }}><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete(event._id!)} style={{ background: 'none', color: 'var(--danger)' }}><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2>{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', color: 'var(--text-main)' }}><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label>Event Title</label>
                                <input style={{ width: '100%' }} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                                {errors.title && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.title}</span>}
                            </div>
                            <div>
                                <label>Category</label>
                                <select style={{ width: '100%' }} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                    <option value="">Select Category</option>
                                    <option value="Movies">Movies</option>
                                    <option value="Music">Music</option>
                                    <option value="Comedy">Comedy</option>
                                    <option value="Workshops">Workshops</option>
                                </select>
                                {errors.category && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.category}</span>}
                            </div>
                            <div>
                                <label>Price (₹)</label>
                                <input style={{ width: '100%' }} type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                                {errors.price && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.price}</span>}
                            </div>
                            <div>
                                <label>Date</label>
                                <input style={{ width: '100%' }} type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                                {errors.date && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.date}</span>}
                            </div>
                            <div>
                                <label>Location</label>
                                <input style={{ width: '100%' }} value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                                {errors.location && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.location}</span>}
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label>Image Source</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <input placeholder="Enter Image URL" style={{ width: '100%' }} value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
                                    <div style={{ textAlign: 'center', color: 'var(--text-grey)', fontSize: '12px' }}>-- OR --</div>
                                    <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} style={{ width: '100%', padding: '5px' }} />
                                </div>
                                {errors.imageUrl && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.imageUrl}</span>}
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label>Description</label>
                                <textarea style={{ width: '100%', height: '80px' }} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                                <button type="submit" className="primary-btn" style={{ width: '100%' }}>{editingEvent ? 'Update Event' : 'Create Event'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
