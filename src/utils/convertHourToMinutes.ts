export default function convertHourTominutes(time: string) {

  // separando a hora por ":" e transformando em number 
  const [hour, minute] = time.split(':').map(Number);

  // transformando hora em minutos junto com o restante de minutos caso houver
  const timeInMinute = (hour * 60) + minute;
  
  return timeInMinute; 
}

