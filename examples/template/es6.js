const student = {
  name: 'James Bond'
};

const teacher = {
  name: 'Ibu Ani',
  room: 'B3'
};

const message = `${student.name} mohon cari ${teacher.name} di ruangan ${
  teacher.room
} untuk ambil rapor.`;

// console.log(message);

const note = `${teacher.name}

Saya, ${student.name}.

Mohon ijin tidak hadir.

Terima Kasih.
`;

console.log(note);
