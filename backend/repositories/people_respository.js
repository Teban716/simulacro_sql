class PeopleRepository {
  constructor(client) {
    this.client = client;
  }

  async bulkInsert(people) {
    const insertQuery = `
            INSERT INTO personas (id_persona, nombres, apellido1, apellido2, correo)
            VALUES ($1, $2, $3, $4, $5)
        `;

    for (const person of people) {
      await this.client.query(insertQuery, [
        person.id_persona,
        person.nombres,
        person.apellido1,
        person.apellido2,
        person.correo,
      ]);
    }

    return { success: true, message: "Datos insertados correctamente" };
  }
}

module.exports = PeopleRepository;
