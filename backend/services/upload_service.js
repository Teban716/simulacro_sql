const pool = require("../config/database");
const PeopleRepository = require("../repositories/people_respository");
const Person = require("../models/person");

class NormalizedAppointments {
  people = [];
  appointments = [];
  doctors = [];
}

class UploadService {
  normalizedData = new NormalizedAppointments();
  peopleRepository = null;

  //funcion de normalizacion de datos y guardarlos
  async processCSVData(rawAppointments) {
    await this.initializeRepositories();

    this.normalizeData(rawAppointments);

    await this.peopleRepository.bulkInsert(this.normalizedData.people);

    return this.normalizedData;
  }

  normalizeData(rawAppointments) {
    rawAppointments.forEach((rawAppointment) => {
      this.normalizedData.people.push(
        this.createPersonModelFromRawData(rawAppointment)
      );
    });
  }

  createPersonModelFromRawData(rawData) {
    let name = rawData["Nombre Paciente"];
    let email = rawData["Correo Paciente"];
    return new Person(crypto.randomUUID(), name, name, name, email);
  }

  async initializeRepositories() {
    let client = await pool.connect();
    this.peopleRepository = new PeopleRepository(client);
  }
}

module.exports = UploadService;
