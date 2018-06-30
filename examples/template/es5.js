const student = {
  name: 'James Bond'
};

const teacher = {
  name: 'Ibu Ani',
  room: 'B3'
};

const message =
  student.name +
  ' mohon cari ' +
  teacher.name +
  ' di ruangan ' +
  teacher.room +
  ' untuk ambil rapor';

// console.log(message);

const note =
  teacher.name +
  ',\n\n' +
  'Saya, ' +
  student.name +
  '.\n' +
  'Mohon ijin tidak hadir.\n\n' +
  'Terima kasih';

console.log(note);
