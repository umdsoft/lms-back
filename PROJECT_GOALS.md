# LMS Platform - Loyiha Maqsadi va Viziya

## Asosiy Maqsad

Bu loyiha zamonaviy **Learning Management System (LMS)** platformasi bo'lib, o'quvchilarni **3 ta asosiy yo'nalishda** professional darajada tayyorlashga qaratilgan:

1. **Matematika**
2. **Ingiliz tili**
3. **Dasturlash**

## Platformaning Asosiy Xususiyatlari

### 1. Obuna Tizimi
- **Oylik yoki yillik obuna** - bir marta to'lab barcha kurslardan foydalanish imkoniyati
- Obuna davomida o'quvchi barcha yo'nalishlardagi barcha kurslarga kirish huquqiga ega

### 2. Ta'lim Tizimi Strukturasi

#### Matematika
- Har bir mavzuda maxsus testlar
- Mavzuni o'zlashtirishni tekshirish tizimi
- Olimpiadalarda qatnashish imkoniyati
- Ballar to'plash orqali progress tracking
- Mavzuni yetarli darajada o'zlashtirmagan talaba keyingi mavzuga o'ta olmaydi
- Qo'shimcha testlar orqali bilimni mustahkamlash

#### Ingiliz Tili
Har bir mavzuda **4 ta asosiy ko'nikma** bo'yicha vazifalar:
- **Speaking** - og'zaki nutq vazifalari
- **Writing** - yozma ishlar
- **Reading** - o'qish vazifalari
- **Listening** - eshitib tushunish vazifalari

Barcha 4 ta ko'nikmani muvaffaqiyatli topshirmagan o'quvchi keyingi mavzuga o'ta olmaydi.

#### Dasturlash
- **Algoritmlar** - algoritmlarga oid nazariy va amaliy bilimlar
- **Contestlar** - dasturlash musobaqalari
- Kod yozish ko'nikmalarini rivojlantirish
- Real vazifalarni yechish tajribasi

### 3. Suniy Intellekt Integratsiyasi
- O'quvchilarning bilimini AI orqali nazorat qilish
- Personallashtirilgan tavsiyalar
- Avtomatik baholash tizimi
- Progress tahlili va yo'naltirish

### 4. Olimpiadalar va Ballar Tizimi
- Turli darajadagi olimpiadalar
- Ballar to'plash orqali motivatsiya
- Reyting tizimi
- Achievement va badgelar

### 5. Marketplace - O'qituvchilar Bilan Ishlash
- O'quvchi ixtiyoriy o'qituvchini tanlash imkoniyati
- **Onlayn mashg'ulotlar** (one-on-one yoki guruhli)
- O'qituvchilar profili va reyting tizimi
- To'lov va bron qilish tizimi
- Video conferencing integratsiyasi

### 6. Progress Tracking va Cheklash Tizimi
- Har bir mavzuda minimal ball yoki natija talab qilinadi
- Yetarli natija bo'lmasa - keyingi mavzuga o'tish bloklangan
- Qo'shimcha mashqlar va testlar tavsiya etiladi
- Progress grafiklari va hisobotlar

## Texnik Talablar

### Authentication
- **JWT** asosida (session yo'q)
- Access token - 1 kun
- Refresh token - 2 kun
- Barcha protected route'lar middleware orqali himoyalangan

### API Strukturasi
- RESTful API
- Swagger dokumentatsiyasi
- Versiyalash (v1, v2, ...)
- Error handling va logging

### Database Modellari

#### Asosiy Entitylar:
1. **Users** (o'quvchilar, o'qituvchilar, adminlar)
2. **Courses** (kurslar)
3. **Subjects** (yo'nalishlar: Math, English, Programming)
4. **Topics** (mavzular)
5. **Lessons** (darslar)
6. **Tests** (testlar)
7. **Assignments** (vazifalar)
   - SpeakingAssignment
   - WritingAssignment
   - ReadingAssignment
   - ListeningAssignment
   - ProgrammingAssignment
8. **Submissions** (topshiriqlar)
9. **Progress** (o'quvchi progressi)
10. **Subscriptions** (obunalar)
11. **Olympiads** (olimpiadalar)
12. **Contests** (contestlar)
13. **Tutoring Sessions** (o'qituvchi bilan darslar)
14. **Payments** (to'lovlar)
15. **Achievements** (yutuqlar)

### Ko'nikmalar va Sifat
- Clean Code tamoyillari
- SOLID prinsiplari
- Mukammal error handling
- Comprehensive testing (unit, integration)
- Security best practices
- Scalable architecture
- Well-documented code
- Performance optimization

## Foydalanuvchi Tajribasi

### O'quvchi uchun:
1. Ro'yxatdan o'tish va obuna sotib olish
2. Yo'nalish tanlash (Math, English, Programming)
3. Kurslarni bosqichma-bosqich o'rganish
4. Har bir mavzuda barcha vazifalarni bajarish
5. Progressni kuzatish
6. Olimpiadalar va contestlarda qatnashish
7. Kerak bo'lsa o'qituvchi bilan onlayn mashg'ulot bronlash

### O'qituvchi uchun:
1. Profil yaratish
2. O'z kurslarini yaratish va boshqarish
3. O'quvchilar bilan onlayn darslar o'tkazish
4. Vazifalarni tekshirish va baholash
5. Daromad olish

### Admin uchun:
1. Barcha foydalanuvchilarni boshqarish
2. Kontent moderatsiyasi
3. Olimpiadalar va contestlar tashkil etish
4. Analytics va hisobotlar
5. Platform sozlamalari

## Muvaffaqiyat Mezonlari

1. **Sifatli ta'lim** - o'quvchilar real bilim olishi
2. **Progressni nazorat** - weak pointlarni aniqlash va tuzatish
3. **Motivatsiya** - gamification orqali o'rganishni qiziqarli qilish
4. **Flexibility** - o'quvchi o'z tezligida o'rganadi
5. **Professional support** - o'qituvchilar yordami doim mavjud
6. **Skallanish** - minglab o'quvchilarga xizmat ko'rsatish

## Kelajak Rejalari

- Qo'shimcha yo'nalishlar qo'shish (Fizika, Kimyo, etc.)
- Mobile app (iOS, Android)
- AI tutor - shaxsiy virtual o'qituvchi
- Live classes va webinarlar
- Community features (forum, chat)
- Gamification kengaytirish
- Integration bilan boshqa platformalar (GitHub, LeetCode, etc.)

---

**Yaratilgan sana:** 2025-10-26
**Versiya:** 1.0
**Maqsad:** O'zbekistonda eng yaxshi onlayn ta'lim platformasini yaratish! 🚀
