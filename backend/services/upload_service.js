const pool = require("../config/database");
const PeopleRepository = require("../repositories/people_respository");
const Person = require("../models/person");
const Speciality = require("../models/speciality");
const Doctor = require("../models/doctor");
const Appointment = require("../models/appointment");
const Patient = require("../models/patient");

/*
appointments: [
  {
    appointment_id,
    patient: {
      person: {
        ...
      }
    },
    doctor: {
      person: {
        ...
      },
      speciality: {
        ...
      }
    },
    payment_method: {
      ...
    },
    reason: {
      ...
    },
    status: {
      ...
    },
    location: {
      ...
    }
  },
]
*/
class NormalizedAppointments {
  appointments = [];
}

class UploadService {
  normalizedData = new NormalizedAppointments();
  peopleRepository = null;

  //funcion de normalizacion de datos y guardarlos
  async processCSVData(rawAppointments) {
    await this.initializeRepositories();

    this.normalizeData(rawAppointments);

    await this.insertPeople();

    return this.normalizedData;
  }

  async insertPeople() {
    // Doctores con nombres unicos
    let doctor_people = Array.from(
      new Map(
        this.normalizedData.appointments
          .map((appointment) => appointment.doctor.person)
          .map((person) => [person.nombres, person])
      ).values()
    );

    let patient_people = this.normalizedData.appointments.map((appointment) => {
      return appointment.patient.person;
    });

    let people = [...doctor_people, ...patient_people];

    await this.peopleRepository.bulkInsert(people);
  }

  normalizeData(rawAppointments) {
    rawAppointments.forEach((rawAppointment) => {
      this.normalizedData.appointments.push(
        this.normalizeAppointment(rawAppointment)
      );
    });
  }

  normalizeAppointment(rawAppointment) {
    let rawData = this.getAppointmentRawData(rawAppointment);

    let normalizedAppointment = new Appointment();

    normalizedAppointment.doctor = this.getDoctorFromRawData(rawData);
    normalizedAppointment.patient = this.getPatientFromRawData(rawData);

    return normalizedAppointment;
  }

  getDoctorFromRawData(rawData) {
    let doctorPerson = new Person(
      crypto.randomUUID(),
      rawData.doctor_name,
      rawData.doctor_name,
      rawData.doctor_name
    );
    let doctorSpeciality = new Speciality(
      crypto.randomUUID(),
      rawData.doctor_speciality
    );
    return new Doctor(crypto.randomUUID(), doctorPerson, doctorSpeciality);
  }

  getPatientFromRawData(rawData) {
    let patientPerson = new Person(
      crypto.randomUUID(),
      rawData.patient_name,
      rawData.patient_name,
      rawData.patient_name,
      rawData.patient_mail
    );

    return new Patient(crypto.randomUUID(), patientPerson);
  }

  getAppointmentRawData(rawAppointment) {
    return {
      patient_name: rawAppointment["Nombre Paciente"],
      patient_mail: rawAppointment["Correo Paciente"],
      doctor_name: rawAppointment["Médico"],
      doctor_speciality: rawAppointment["Especialidad"],
      appointment_date: rawAppointment["Fecha Cita"],
      appointment_time: rawAppointment["Hora Cita"],
      reason: rawAppointment["Motivo"],
      reason_description: rawAppointment["Descripción"],
      location: rawAppointment["Ubicación"],
      payment_method: rawAppointment["Metodo de Pago"],
      status: rawAppointment["Estatus Cita"],
    };
  }

  async initializeRepositories() {
    let client = await pool.connect();
    this.peopleRepository = new PeopleRepository(client);
  }
}

module.exports = UploadService;
