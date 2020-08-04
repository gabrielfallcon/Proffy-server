import express from 'express';
import db from './database/connection';
import convertHourTominutes from './utils/convertHourToMinutes';

const routes = express.Router();

interface Scheduleitem {
  week_day: number;
  from: string;
  to: string;
}

routes.post('/classes', async(request, response) => {
  const {
    name,
    avatar,
    whatsapp,
    bio,
    subject,
    cost,
    schedule
  } = request.body;

  // criando uma transaction para inserir no banco apenas se 
  // todas as informações estiverem corretas
  const trx = await db.transaction();

  try {
    const insertedUsersIds = await trx('users').insert({
      name,
      avatar,
      whatsapp,
      bio
    });
  
    const user_id = insertedUsersIds[0];
  
    const insertedClassesIds = await trx('classes').insert({
      subject,
      cost,
      user_id
    });
  
    const class_id = insertedClassesIds[0];
  
    // trasnformando horas em minutos 
    const classSchedule = schedule.map((scheduleItem: Scheduleitem) => {
      return {
        class_id,
        week_day: scheduleItem.week_day,
        from: convertHourTominutes(scheduleItem.from),
        to: convertHourTominutes(scheduleItem.to)
      }
    });
  
    await trx('class_schedule').insert(classSchedule);
  
    await trx.commit();
  
    return response.send();
  } catch (err) {
    return response.status(400).json({ 
      error: 'Unexpected error while creating new class'  
    });
  }
});

export default routes;