import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { BASE_URL } from '../utils/api';

export default function AdminCouponManagement() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percent',
    discountValue: 0,
    minOrder: 0,
    maxUsage: 100,
    isActive: true,
    priority: 1,
    applicableCafes: 'ALL'
  });

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/coupons/admin/all`);
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (error) {
      toast.error('Failed to fetch coupons');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSave = async () => {
    try {
      const url = isEditing === 'new' 
        ? `${BASE_URL}/api/coupons/admin/create`
        : `${BASE_URL}/api/coupons/admin/update/${isEditing}`;
      
      const method = isEditing === 'new' ? 'POST' : 'PUT';

      const payload = {
        ...formData,
        applicableCafes: formData.applicableCafes.split(',').map(s => s.trim())
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(isEditing === 'new' ? 'Coupon created!' : 'Coupon updated!');
        setIsEditing(null);
        fetchCoupons();
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to save coupon');
      }
    } catch (e) {
      toast.error('Error saving coupon');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      const res = await fetch(`${BASE_URL}/api/coupons/admin/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Coupon deleted');
        fetchCoupons();
      }
    } catch (e) {
      toast.error('Error deleting coupon');
    }
  };

  const editCoupon = (c: any) => {
    setIsEditing(c._id);
    setFormData({
      code: c.code,
      description: c.description || '',
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrder: c.minOrder,
      maxUsage: c.maxUsage,
      isActive: c.isActive,
      priority: c.priority || 1,
      applicableCafes: c.applicableCafes ? c.applicableCafes.join(', ') : 'ALL'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold font-sans text-slate-800">Coupon Management</h3>
        <Button onClick={() => { setIsEditing('new'); setFormData({ code: '', description: '', discountType: 'percent', discountValue: 0, minOrder: 0, maxUsage: 100, isActive: true, priority: 1, applicableCafes: 'ALL' }); }} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Coupon
        </Button>
      </div>

      {isEditing && (
        <Card className="p-6 bg-slate-50 border-indigo-100">
          <h4 className="font-bold mb-4">{isEditing === 'new' ? 'Create New Coupon' : 'Edit Coupon'}</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Coupon Code</label>
              <input type="text" className="w-full p-2 border rounded" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Description</label>
              <input type="text" className="w-full p-2 border rounded" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Type</label>
              <select className="w-full p-2 border rounded" value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value as any})}>
                <option value="percent">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Value</label>
              <input type="number" className="w-full p-2 border rounded" value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Base Min Order (₹)</label>
              <input type="number" className="w-full p-2 border rounded" value={formData.minOrder} onChange={e => setFormData({...formData, minOrder: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Applicable Cafes (comma separated)</label>
              <input type="text" className="w-full p-2 border rounded" value={formData.applicableCafes} onChange={e => setFormData({...formData, applicableCafes: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="ghost" onClick={() => setIsEditing(null)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white"><Save className="w-4 h-4 mr-2"/> Save Coupon</Button>
          </div>
        </Card>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Usage / Max</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Cafes</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((c) => (
            <TableRow key={c._id}>
              <TableCell className="font-bold text-indigo-600">{c.code}</TableCell>
              <TableCell>{c.discountType === 'percent' ? `${c.discountValue}%` : `₹${c.discountValue}`}</TableCell>
              <TableCell>{c.usedCount || 0} / {c.maxUsage}</TableCell>
              <TableCell><Badge variant={c.isActive ? 'default' : 'secondary'}>{c.isActive ? 'Active' : 'Disabled'}</Badge></TableCell>
              <TableCell className="max-w-[150px] truncate">{c.applicableCafes?.join(', ')}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => editCoupon(c)}><Edit2 className="w-4 h-4"/></Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(c._id)}><Trash2 className="w-4 h-4"/></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
