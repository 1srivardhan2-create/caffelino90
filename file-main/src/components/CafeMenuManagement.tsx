import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Upload, ImageIcon, Coffee, UtensilsCrossed, Cake } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';
import { safeStorage } from '../utils/safeStorage';

export interface MenuItem {
  _id?: string;
  item_name: string;
  Category: 'Beverages' | 'Food' | 'Desserts' | 'Pizzas';
  food_type: 'Veg' | 'Non-Veg';
  price: number;
  description_food?: string;
  available: boolean;
  image_url?: string;
  imageFile?: File; // For frontend uploading
}

const API_BASE_URL = 'https://caffelino90-9v4a.onrender.com/api';

export default function CafeMenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    item_name: '',
    Category: 'Beverages',
    food_type: 'Veg',
    price: 0,
    description_food: '',
    available: true,
  });

  const fetchMenuItems = async () => {
    try {
      const token = safeStorage.getItem('cafeToken') || safeStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/cafe/cafe/items`, {
        credentials: 'omit',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch menu items');
      const data = await res.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Failed to load menu items:', error);
    }
  };

  // Load menu items from API on mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.item_name || !newItem.price || newItem.price <= 0) {
      toast.error('Please fill all required fields with valid values');
      return;
    }
    if (isSaving) return;

    if (newItem.image_url && newItem.image_url.trim()) {
      const url = newItem.image_url.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        toast.error('Please enter a valid image URL (must start with http:// or https://)');
        return;
      }
    }

    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append('item_name', newItem.item_name);
      formData.append('Category', newItem.Category || 'Beverages');
      formData.append('food_type', newItem.food_type || 'Veg');
      formData.append('price', String(newItem.price || 0));
      formData.append('description_food', newItem.description_food || '');
      formData.append('available', 'true');

      if (newItem.image_url && newItem.image_url.trim()) {
        formData.append('image_url', newItem.image_url.trim());
      }
      if (newItem.imageFile) {
        formData.append('image', newItem.imageFile);
      }

      const token = safeStorage.getItem('cafeToken') || safeStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/cafe/menuItem/cafe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
        credentials: 'omit'
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('Server response:', res.status, errData);
        throw new Error(errData.message || 'Failed to add item');
      }

      toast.success(`${newItem.item_name} added to menu!`);
      setShowAddDialog(false);
      resetForm();
      fetchMenuItems();
    } catch (error: any) {
      console.error('Add item error:', error);
      toast.error(error.message || 'Failed to add item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setNewItem(item);
    setShowEditDialog(true);
  };

  const handleUpdateItem = async () => {
    if (!newItem.item_name || !newItem.price || !selectedItem || newItem.price <= 0) {
      toast.error('Please fill all required fields with valid values');
      return;
    }
    if (isSaving) return;

    if (newItem.image_url && newItem.image_url.trim()) {
      const url = newItem.image_url.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        toast.error('Please enter a valid image URL (must start with http:// or https://)');
        return;
      }
    }

    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append('item_name', newItem.item_name);
      formData.append('Category', newItem.Category || 'Beverages');
      formData.append('food_type', newItem.food_type || 'Veg');
      formData.append('price', String(newItem.price || 0));
      formData.append('description_food', newItem.description_food || '');

      if (newItem.image_url && newItem.image_url.trim()) {
        formData.append('image_url', newItem.image_url.trim());
      }
      if (newItem.imageFile) {
        formData.append('image', newItem.imageFile);
      }

      const token = safeStorage.getItem('cafeToken') || safeStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/cafe/menuItem/edit/${selectedItem._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
        credentials: 'omit'
      });

      if (!res.ok) throw new Error('Failed to update item');

      toast.success('Menu item updated successfully!');
      setShowEditDialog(false);
      setSelectedItem(null);
      resetForm();
      fetchMenuItems();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const token = safeStorage.getItem('cafeToken') || safeStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/cafe/delete/item/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'omit'
        });

        if (!res.ok) throw new Error('Failed to delete item');

        toast.success('Menu item deleted');
        fetchMenuItems();
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete item');
      }
    }
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      const token = safeStorage.getItem('cafeToken') || safeStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/cafe/menuItem/availability/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'omit'
      });

      if (!res.ok) throw new Error('Failed to toggle availability');

      const item = menuItems.find(i => i._id === id);
      toast.success(`${item?.item_name || 'Item'} marked as ${item?.available ? 'Unavailable' : 'Available'}`);
      fetchMenuItems();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update availability');
    }
  };

  const resetForm = () => {
    setNewItem({
      item_name: '',
      Category: 'Beverages',
      food_type: 'Veg',
      price: 0,
      description_food: '',
      available: true,
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Beverages': return <Coffee className="size-5 text-amber-600" />;
      case 'Food': return <UtensilsCrossed className="size-5 text-green-600" />;
      case 'Desserts': return <Cake className="size-5 text-pink-600" />;
      default: return null;
    }
  };

  const beverages = menuItems.filter(item => item.Category === 'Beverages');
  const foods = menuItems.filter(item => item.Category === 'Food');
  const desserts = menuItems.filter(item => item.Category === 'Desserts');
  const pizzas = menuItems.filter(item => item.Category === 'Pizzas');

  // Empty State
  if (menuItems.length === 0) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[28px] leading-[36px] text-neutral-950 mb-2">Menu Management</h1>
          <p className="text-[14px] text-slate-600">Add and manage your cafe menu items</p>
        </div>

        {/* Empty State */}
        <div className="flex items-center justify-center min-h-[500px]">
          <Card className="max-w-md w-full p-12 text-center">
            <div className="bg-slate-100 size-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <UtensilsCrossed className="size-10 text-slate-400" />
            </div>
            <h2 className="text-[24px] text-neutral-950 mb-3">No menu items added yet</h2>
            <p className="text-[14px] text-slate-600 mb-8">
              Start by adding your first menu item to get started
            </p>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-[#be9d80] hover:bg-[#a88a6e] text-white h-[44px] px-8"
              size="lg"
            >
              <Plus className="size-5 mr-2" />
              Add First Menu Item
            </Button>
          </Card>
        </div>

        {/* Add Item Dialog */}
        <AddEditDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          newItem={newItem}
          setNewItem={setNewItem}
          onSave={handleAddItem}
          isEdit={false}
          isSaving={isSaving}
        />
      </div>
    );
  }

  // Menu Items Display
  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] leading-[36px] text-neutral-950 mb-2">Menu Management</h1>
          <p className="text-[14px] text-slate-600">Manage your cafe menu items</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-[#be9d80] hover:bg-[#a88a6e] text-white h-[44px] px-6"
        >
          <Plus className="size-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="p-4 border-2">
          <p className="text-[12px] text-slate-600 mb-1">Total Items</p>
          <p className="text-[28px] leading-[36px] text-neutral-950">{menuItems.length}</p>
        </Card>
        <Card className="p-4 border-2 border-amber-200 bg-amber-50">
          <div className="flex items-center gap-2 mb-1">
            <Coffee className="size-4 text-amber-600" />
            <p className="text-[12px] text-amber-700">Beverages</p>
          </div>
          <p className="text-[28px] leading-[36px] text-amber-600">{beverages.length}</p>
        </Card>
        <Card className="p-4 border-2 border-green-200 bg-green-50">
          <div className="flex items-center gap-2 mb-1">
            <UtensilsCrossed className="size-4 text-green-600" />
            <p className="text-[12px] text-green-700">Food Items</p>
          </div>
          <p className="text-[28px] leading-[36px] text-green-600">{foods.length}</p>
        </Card>
        <Card className="p-4 border-2 border-pink-200 bg-pink-50">
          <div className="flex items-center gap-2 mb-1">
            <Cake className="size-4 text-pink-600" />
            <p className="text-[12px] text-pink-700">Desserts</p>
          </div>
          <p className="text-[28px] leading-[36px] text-pink-600">{desserts.length}</p>
        </Card>
        <Card className="p-4 border-2 border-orange-200 bg-orange-50">
          <div className="flex items-center gap-2 mb-1">
            <UtensilsCrossed className="size-4 text-orange-600" />
            <p className="text-[12px] text-orange-700">Pizzas</p>
          </div>
          <p className="text-[28px] leading-[36px] text-orange-600">{pizzas.length}</p>
        </Card>
      </div>

      {/* Beverages Section */}
      {beverages.length > 0 && (
        <div>
          <h2 className="text-[20px] leading-[28px] text-neutral-950 mb-4 flex items-center gap-2">
            <Coffee className="size-5 text-amber-600" />
            Beverages
            <Badge variant="secondary" className="ml-2">{beverages.length}</Badge>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {beverages.map(item => (
              <MenuItemCard
                key={item._id}
                item={item}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onToggleAvailability={handleToggleAvailability}
              />
            ))}
          </div>
        </div>
      )}

      {/* Food Section */}
      {foods.length > 0 && (
        <div>
          <h2 className="text-[20px] leading-[28px] text-neutral-950 mb-4 flex items-center gap-2">
            <UtensilsCrossed className="size-5 text-green-600" />
            Food Items
            <Badge variant="secondary" className="ml-2">{foods.length}</Badge>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {foods.map(item => (
              <MenuItemCard
                key={item._id}
                item={item}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onToggleAvailability={handleToggleAvailability}
              />
            ))}
          </div>
        </div>
      )}

      {/* Desserts Section */}
      {desserts.length > 0 && (
        <div>
          <h2 className="text-[20px] leading-[28px] text-neutral-950 mb-4 flex items-center gap-2">
            <Cake className="size-5 text-pink-600" />
            Desserts
            <Badge variant="secondary" className="ml-2">{desserts.length}</Badge>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {desserts.map(item => (
              <MenuItemCard
                key={item._id}
                item={item}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onToggleAvailability={handleToggleAvailability}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pizzas Section */}
      {pizzas.length > 0 && (
        <div>
          <h2 className="text-[20px] leading-[28px] text-neutral-950 mb-4 flex items-center gap-2">
            <Cake className="size-5 text-red-600" />
            Pizzas
            <Badge variant="secondary" className="ml-2">{pizzas.length}</Badge>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pizzas.map(item => (
              <MenuItemCard
                key={item._id}
                item={item}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onToggleAvailability={handleToggleAvailability}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <AddEditDialog
        open={showAddDialog || showEditDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddDialog(false);
            setShowEditDialog(false);
            setSelectedItem(null);
            resetForm();
          }
        }}
        newItem={newItem}
        setNewItem={setNewItem}
        onSave={showEditDialog ? handleUpdateItem : handleAddItem}
        isEdit={showEditDialog}
        isSaving={isSaving}
      />
    </div>
  );
}

// Menu Item Card Component
function MenuItemCard({
  item,
  onEdit,
  onDelete,
  onToggleAvailability
}: {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string, name: string) => void;
  onToggleAvailability: (id: string) => void;
}) {
  const [imageError, setImageError] = useState(false);

  const getDefaultImage = (category: string) => {
    // Default placeholder images based on category
    switch (category) {
      case 'Beverages':
        return 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop';
      case 'Food':
        return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
      case 'Desserts':
        return 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop';
      case 'Pizzas':
        return 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop';
    }
  };

  const getDisplayImage = () => {
    if (imageError || !item.image_url) return getDefaultImage(item.Category);
    if (item.image_url.startsWith('/uploads/')) return `https://caffelino90-9v4a.onrender.com${item.image_url}`;
    return item.image_url;
  };

  const displayImage = getDisplayImage();

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {/* Image Section */}
      <div className="relative h-40 w-full bg-slate-100">
        <img
          src={displayImage}
          alt={item.item_name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
        {/* Veg/Non-Veg Badge Overlay */}
        <div className="absolute top-2 left-2">
          <div className={`
            w-6 h-6 border-2 flex items-center justify-center rounded bg-white shadow-sm
            ${item.food_type === 'Veg' ? 'border-green-600' : 'border-red-600'}
          `}>
            <div className={`
              w-3 h-3 rounded-full
              ${item.food_type === 'Veg' ? 'bg-green-600' : 'bg-red-600'}
            `} />
          </div>
        </div>
        {/* Availability Badge Overlay */}
        <div className="absolute top-2 right-2">
          <Badge variant={item.available ? 'default' : 'secondary'} className="shadow-sm">
            {item.available ? 'Available' : 'Out of Stock'}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-[16px] text-neutral-950 mb-1">{item.item_name}</h3>
          <p className="text-[20px] leading-[28px] text-green-600">₹{item.price}</p>
        </div>

        {item.description_food && (
          <p className="text-[12px] text-slate-600 mb-3 line-clamp-2">{item.description_food}</p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(item)}
            className="flex-1 min-w-[70px]"
          >
            <Edit2 className="size-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleAvailability(item._id!)}
            className="flex-1 min-w-[120px]"
          >
            {item.available ? 'Mark Unavailable' : 'Mark Available'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item._id!, item.item_name)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Add/Edit Dialog Component
function AddEditDialog({
  open,
  onOpenChange,
  newItem,
  setNewItem,
  onSave,
  isEdit,
  isSaving,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newItem: Partial<MenuItem>;
  setNewItem: (item: Partial<MenuItem>) => void;
  onSave: () => void;
  isEdit: boolean;
  isSaving: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the menu item details' : 'Fill in the details to add a new menu item'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item Name */}
          <div>
            <Label htmlFor="itemName" className="text-[14px]">
              Item Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="itemName"
              value={newItem.item_name || ''}
              onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
              placeholder="e.g., Cappuccino, Paneer Sandwich"
              className="mt-2 h-[44px]"
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="text-[14px]">
              Category <span className="text-red-500">*</span>
            </Label>
            <select
              id="category"
              value={newItem.Category || 'Beverages'}
              onChange={(e) => setNewItem({ ...newItem, Category: e.target.value as any })}
              className="w-full h-[44px] px-3 rounded-lg bg-white border border-slate-300 mt-2 text-[14px]"
            >
              <option value="Beverages">Beverages</option>
              <option value="Food">Food</option>
              <option value="Desserts">Desserts</option>
              <option value="Pizzas">Pizzas</option>
            </select>
          </div>

          {/* Food Type (Veg/Non-Veg) */}
          <div>
            <Label className="text-[14px] mb-3 block">
              Food Type <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-3 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="foodType"
                  value="veg"
                  checked={newItem.food_type === 'Veg'}
                  onChange={(e) => setNewItem({ ...newItem, food_type: 'Veg' })}
                  className="w-4 h-4 text-green-600"
                />
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-green-600 flex items-center justify-center rounded">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                  </div>
                  <span className="text-[14px]">Veg</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="foodType"
                  value="nonveg"
                  checked={newItem.food_type === 'Non-Veg'}
                  onChange={(e) => setNewItem({ ...newItem, food_type: 'Non-Veg' })}
                  className="w-4 h-4 text-red-600"
                />
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-red-600 flex items-center justify-center rounded">
                    <div className="w-2 h-2 bg-red-600 rounded-full" />
                  </div>
                  <span className="text-[14px]">Non-Veg</span>
                </div>
              </label>
            </div>
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price" className="text-[14px]">
              Price (₹) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              value={newItem.price || ''}
              onChange={(e) => setNewItem({ ...newItem, price: parseInt(e.target.value) || 0 })}
              placeholder="120"
              min="1"
              className="mt-2 h-[44px]"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-[14px]">
              Description <span className="text-slate-400">(Optional)</span>
            </Label>
            <Textarea
              id="description"
              value={newItem.description_food || ''}
              onChange={(e) => setNewItem({ ...newItem, description_food: e.target.value })}
              placeholder="Brief description of the item..."
              className="mt-2 min-h-[80px] resize-none"
              maxLength={150}
            />
            <p className="text-[11px] text-slate-500 mt-1">
              {(newItem.description_food || '').length}/150 characters
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="imageUpload" className="text-[14px]">
              Upload Photo <span className="text-slate-400">(Optional)</span>
            </Label>
            <div className="flex gap-2 items-start mt-2">
              {(newItem.image_url || newItem.imageFile) && (
                <div className="h-16 w-16 min-w-16 rounded overflow-hidden border">
                  <img
                    src={newItem.imageFile ? URL.createObjectURL(newItem.imageFile) : newItem.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <Input
                  id="imageUpload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewItem({ ...newItem, imageFile: file, image_url: '' });
                    }
                  }}
                  className="pt-2 h-[44px]"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  You can also paste an image URL instead below.
                </p>
                <Input
                  id="imageUrl"
                  value={newItem.image_url || ''}
                  onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value, imageFile: undefined })}
                  placeholder="Or enter HTTP/HTTPS image URL"
                  className="mt-2 h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-[44px]"
            >
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={isSaving}
              className="flex-1 h-[44px] bg-[#be9d80] hover:bg-[#a88a6e] text-white disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : (isEdit ? 'Update Item' : 'Save Item')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
