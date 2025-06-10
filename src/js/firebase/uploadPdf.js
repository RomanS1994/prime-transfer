import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseConfig.js';
import { jsPDF } from 'jspdf';

export async function uploadTransferPdf(payload) {
  console.log('🚀 uploadTransferPdf стартує з payload:', payload);

  console.log('Create pdf');
  const doc = new jsPDF();
  doc.text('Нова заявка на трансфер:', 10, 10);
  doc.text(`Ім’я: ${payload['user-name']}`, 10, 20);
  doc.text(`Email: ${payload['user-email']}`, 10, 30);
  doc.text(`Телефон: ${payload['user-phone']}`, 10, 40);
  doc.text(`Час: ${payload.time}`, 10, 50);
  doc.text(`Звідки: ${payload.from}`, 10, 60);
  doc.text(`Куди: ${payload.to}`, 10, 70);
  doc.text(`Координати A: ${payload.fromCoords}`, 10, 80);
  doc.text(`Координати B: ${payload.toCoords}`, 10, 90);

  const blob = doc.output('blob');
  console.log(blob);
  const fileName = `transfer_${Date.now()}.pdf`;

  const fileRef = ref(storage, `pdfs/${fileName}`);

  try {
    const fileRef = ref(storage, `pdfs/${fileName}`);
    console.log(1);
    await uploadBytes(fileRef, blob); // ⬅️ може впасти тут
    console.log(2);
    const downloadURL = await getDownloadURL(fileRef); // ⬅️ або тут
    console.log(3);
    console.log('✅ PDF uploaded:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error(
      '❌ Помилка під час завантаження або отримання URL PDF:',
      error
    );
    alert('Не вдалося завантажити PDF на сервер. Перевірте консоль.');
    throw error; // якщо хочеш, щоб помилка також передавалась далі
  }
}
