# 🎨 Frontend Integration Guide - Course Creation

## ✅ Backend O'zgarishlari

**Yangi Xususiyat:** `directionId` endi **ixtiyoriy** (optional)!

- ❌ Eski: `directionId` majburiy bo'lgan
- ✅ Yangi: `directionId` yuborilmasa, default direction (Programming - ID: 1) ishlatiladi

### Backend Holati

```javascript
// ✅ IKKALA VARIANT HAM ISHLAYDI:

// Variant 1: directionId bilan
{
  "name": "JavaScript Course",
  "directionId": 1,           // ✅ Aniq direction
  "level": "beginner",
  "description": "Test"
}

// Variant 2: directionId siz (yangi!)
{
  "name": "JavaScript Course",
  "level": "beginner",        // ✅ Avtomatik Programming (ID: 1) ishlatiladi
  "description": "Test"
}
```

## 🎯 Frontend Uchun 2 Variant

### Variant 1: Optimal - Direction Selector Qo'shish (TAVSIYA)

Bu eng yaxshi user experience beradi va to'liq boshqaruvni ta'minlaydi.

#### 1.1. Direction API Endpoint

```javascript
// GET /api/v1/directions
// Response:
{
  "success": true,
  "data": {
    "directions": [
      { "id": 1, "name": "Programming", "slug": "programming", "color": "blue", "icon": "Code" },
      { "id": 2, "name": "Mathematics", "slug": "mathematics", "color": "purple", "icon": "Calculator" },
      { "id": 3, "name": "English Language", "slug": "english-language", "color": "orange", "icon": "BookOpen" },
      { "id": 4, "name": "Science", "slug": "science", "color": "green", "icon": "Flask" },
      { "id": 5, "name": "Business & Finance", "slug": "business-finance", "color": "indigo", "icon": "Briefcase" },
      { "id": 6, "name": "Design", "slug": "design", "color": "pink", "icon": "Palette" },
      { "id": 7, "name": "History & Geography", "slug": "history-geography", "color": "yellow", "icon": "Globe" },
      { "id": 8, "name": "Test Preparation", "slug": "test-preparation", "color": "red", "icon": "GraduationCap" }
    ]
  }
}
```

#### 1.2. React/Next.js Implementation

```typescript
// hooks/useDirections.ts
import { useState, useEffect } from 'react';

interface Direction {
  id: number;
  name: string;
  slug: string;
  color: string;
  icon: string;
}

export function useDirections() {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDirections = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/v1/directions', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch directions');
        }

        const data = await response.json();
        setDirections(data.data.directions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchDirections();
  }, []);

  return { directions, loading, error };
}
```

```tsx
// components/CourseForm.tsx
import { useState } from 'react';
import { useDirections } from '@/hooks/useDirections';

interface CourseFormData {
  name: string;
  directionId: number | null;
  level: string;
  description: string;
  pricingType: 'subscription' | 'individual';
  price: number;
}

export function CourseForm() {
  const { directions, loading: directionsLoading } = useDirections();
  const [formData, setFormData] = useState<CourseFormData>({
    name: '',
    directionId: null,
    level: 'beginner',
    description: '',
    pricingType: 'subscription',
    price: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const levels = [
    { value: 'beginner', label: 'Boshlang\'ich' },
    { value: 'elementary', label: 'Elementar' },
    { value: 'intermediate', label: 'O\'rta' },
    { value: 'upper-intermediate', label: 'O\'rta-Yuqori' },
    { value: 'advanced', label: 'Yuqori' },
    { value: 'proficiency', label: 'Professional' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'Kurs nomi kamida 3 ta belgidan iborat bo\'lishi kerak';
    }

    if (!formData.directionId) {
      newErrors.directionId = 'Yo\'nalishni tanlang';
    }

    if (!formData.level) {
      newErrors.level = 'Darajani tanlang';
    }

    if (formData.pricingType === 'individual' && (!formData.price || formData.price <= 0)) {
      newErrors.price = 'Individual kurslar uchun narx kiritilishi shart';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/v1/courses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle specific error messages
        if (errorData.message === 'Direction not found') {
          setErrors({ directionId: 'Tanlangan yo\'nalish topilmadi' });
        } else if (errorData.message.includes('Invalid level')) {
          setErrors({ level: 'Darajani to\'g\'ri tanlang' });
        } else if (errorData.message.includes('Price is required')) {
          setErrors({ price: 'Individual kurslar uchun narx kiritilishi shart' });
        } else {
          alert('Xatolik: ' + errorData.message);
        }
        return;
      }

      const data = await response.json();
      alert('Kurs muvaffaqiyatli yaratildi!');
      // Reset form or redirect
      window.location.href = '/courses';
    } catch (error) {
      alert('Tarmoq xatosi yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Course Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Kurs nomi *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`mt-1 block w-full rounded-md border ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 focus:border-blue-500 focus:outline-none`}
          placeholder="Masalan: JavaScript Asoslari"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Direction Selector */}
      <div>
        <label htmlFor="directionId" className="block text-sm font-medium text-gray-700">
          Yo'nalish *
        </label>
        <select
          id="directionId"
          value={formData.directionId || ''}
          onChange={(e) => setFormData({ ...formData, directionId: Number(e.target.value) })}
          className={`mt-1 block w-full rounded-md border ${
            errors.directionId ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 focus:border-blue-500 focus:outline-none`}
          disabled={directionsLoading}
        >
          <option value="">Yo'nalishni tanlang</option>
          {directions.map((direction) => (
            <option key={direction.id} value={direction.id}>
              {direction.name}
            </option>
          ))}
        </select>
        {errors.directionId && <p className="mt-1 text-sm text-red-600">{errors.directionId}</p>}
      </div>

      {/* Level Selector */}
      <div>
        <label htmlFor="level" className="block text-sm font-medium text-gray-700">
          Daraja *
        </label>
        <select
          id="level"
          value={formData.level}
          onChange={(e) => setFormData({ ...formData, level: e.target.value })}
          className={`mt-1 block w-full rounded-md border ${
            errors.level ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 focus:border-blue-500 focus:outline-none`}
        >
          {levels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
        {errors.level && <p className="mt-1 text-sm text-red-600">{errors.level}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Tavsif
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="Kurs haqida qisqacha ma'lumot"
        />
      </div>

      {/* Pricing Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Narx turi
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="subscription"
              checked={formData.pricingType === 'subscription'}
              onChange={(e) => setFormData({ ...formData, pricingType: 'subscription', price: 0 })}
              className="mr-2"
            />
            <span>Obuna (bepul)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="individual"
              checked={formData.pricingType === 'individual'}
              onChange={(e) => setFormData({ ...formData, pricingType: 'individual' })}
              className="mr-2"
            />
            <span>Individual (pullik)</span>
          </label>
        </div>
      </div>

      {/* Price (only for individual) */}
      {formData.pricingType === 'individual' && (
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Narx (UZS) *
          </label>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className={`mt-1 block w-full rounded-md border ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 focus:border-blue-500 focus:outline-none`}
            placeholder="299000"
            min="0"
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Bekor qilish
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Yuklanmoqda...' : 'Yaratish'}
        </button>
      </div>
    </form>
  );
}
```

#### 1.3. Direction Cards Alternative (More Visual)

```tsx
// components/DirectionSelector.tsx
import { useDirections } from '@/hooks/useDirections';

interface DirectionSelectorProps {
  value: number | null;
  onChange: (directionId: number) => void;
  error?: string;
}

const iconMap: Record<string, string> = {
  'Code': '💻',
  'Calculator': '🔢',
  'BookOpen': '📖',
  'Flask': '🧪',
  'Briefcase': '💼',
  'Palette': '🎨',
  'Globe': '🌍',
  'GraduationCap': '🎓',
};

export function DirectionSelector({ value, onChange, error }: DirectionSelectorProps) {
  const { directions, loading } = useDirections();

  if (loading) {
    return <div className="animate-pulse">Yuklanmoqda...</div>;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Yo'nalish *
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {directions.map((direction) => (
          <button
            key={direction.id}
            type="button"
            onClick={() => onChange(direction.id)}
            className={`
              p-4 rounded-lg border-2 transition-all
              ${value === direction.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="text-3xl mb-2">{iconMap[direction.icon] || '📚'}</div>
            <div className="text-sm font-medium text-gray-900">{direction.name}</div>
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

### Variant 2: Minimal - Hozirgi Formani Saqlash

Agar hozircha directionId qo'shishni xohlamasangiz, backend avtomatik default direction ishlatadi.

```typescript
// Hech narsa o'zgartirmasdan, faqat directionId ni yubormasangiz ham ishlaydi
const formData = {
  name: 'Test Course',
  level: 'beginner',
  description: 'Test',
  pricingType: 'subscription',
  price: 0,
  // directionId: undefined  // ✅ Backend avtomatik Programming (ID: 1) ishlatadi
};
```

## 📊 Error Handling

### Backend Error Messages

```typescript
// Error response format
{
  "success": false,
  "message": "Error message here"
}
```

### Error Messages to Handle

| Status | Message | User-Friendly Message |
|--------|---------|----------------------|
| 400 | "Course name is required" | "Kurs nomini kiriting" |
| 400 | "Direction ID is required..." | "Yo'nalishni tanlang" |
| 400 | "Course level is required" | "Darajani tanlang" |
| 400 | "Invalid level..." | "Darajani to'g'ri tanlang" |
| 400 | "Price is required..." | "Individual kurslar uchun narx kiriting" |
| 404 | "Direction not found" | "Tanlangan yo'nalish topilmadi" |
| 404 | "Teacher not found" | "O'qituvchi topilmadi" |

### Error Handling Example

```typescript
const handleError = (errorMessage: string) => {
  const errorMap: Record<string, string> = {
    'Course name is required': 'Kurs nomini kiriting',
    'Direction ID is required': 'Yo\'nalishni tanlang',
    'Course level is required': 'Darajani tanlang',
    'Direction not found': 'Tanlangan yo\'nalish topilmadi',
    'Teacher not found': 'O\'qituvchi topilmadi',
  };

  // Check for partial matches
  for (const [key, value] of Object.entries(errorMap)) {
    if (errorMessage.includes(key)) {
      return value;
    }
  }

  return 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.';
};
```

## 🎨 UI/UX Recommendations

### 1. Toast Notifications

```typescript
// Using react-hot-toast
import toast from 'react-hot-toast';

// Success
toast.success('Kurs muvaffaqiyatli yaratildi!');

// Error
toast.error(handleError(errorMessage));

// Loading
const loadingToast = toast.loading('Yuklanmoqda...');
// Later
toast.dismiss(loadingToast);
```

### 2. Form Validation (Real-time)

```typescript
const [touched, setTouched] = useState<Record<string, boolean>>({});

const handleBlur = (field: string) => {
  setTouched({ ...touched, [field]: true });
};

// Show error only if field is touched
{touched.name && errors.name && (
  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
)}
```

### 3. Success Redirect

```typescript
// After successful creation
const data = await response.json();
toast.success('Kurs yaratildi!');

// Option 1: Redirect to courses list
router.push('/courses');

// Option 2: Redirect to new course page
router.push(`/courses/${data.data.id}`);

// Option 3: Stay and reset form
setFormData(initialFormData);
```

## 🚀 Testing

### Test Checklist

- [ ] Directions list yuklanadi
- [ ] Direction tanlash ishlaydi
- [ ] Form validation ishlaydi
- [ ] Course yaratish ishlaydi (directionId bilan)
- [ ] Course yaratish ishlaydi (directionId siz)
- [ ] Error messages to'g'ri ko'rsatiladi
- [ ] Success redirect ishlaydi
- [ ] Loading states ko'rsatiladi

### Test Scenarios

```typescript
// Test 1: With directionId
const testData1 = {
  name: 'JavaScript Course',
  directionId: 1,
  level: 'beginner',
  description: 'Learn JS',
  pricingType: 'subscription',
  price: 0,
};

// Test 2: Without directionId (should use default)
const testData2 = {
  name: 'Python Course',
  level: 'intermediate',
  description: 'Learn Python',
  pricingType: 'individual',
  price: 299000,
};

// Test 3: Invalid data (should show errors)
const testData3 = {
  name: 'AB', // Too short
  level: 'invalid-level', // Invalid
  pricingType: 'individual',
  price: 0, // Should be > 0 for individual
};
```

## 📝 Summary

### Backend Changes
- ✅ `directionId` endi optional
- ✅ Default direction avtomatik ishlatiladi
- ✅ Barcha validation ishlayapti

### Frontend Recommendations

**Option 1 (TAVSIYA): Direction Selector qo'shish**
- Better UX
- To'liq boshqaruv
- Professional ko'rinish

**Option 2: Hozirgi formani saqlash**
- Minimal changes
- Backend default direction ishlatadi
- Tezkor yechim

### Next Steps

1. Direction selector qo'shish (tavsiya)
2. Error handling yaxshilash
3. Toast notifications qo'shish
4. Loading states qo'shish
5. Form validation (real-time)

---

**Tayyorlagan:** Claude Code
**Sana:** 2025-11-16
**Status:** ✅ Backend tayyor, Frontend integration ready
