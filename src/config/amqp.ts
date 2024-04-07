import amqp from 'amqplib';
import { UserDto } from '../dto/userDto';
import { AMQP_URL, QUEUE_NAME } from '../env/config';


const amqp_url = AMQP_URL as string;
const queueName = QUEUE_NAME as string;

let channel: amqp.Channel | null = null; 

export async function amqp_setup() {
  try {
    const connection = await amqp.connect(amqp_url);
    channel = await connection.createChannel();
    await channel.assertQueue(queueName);
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function sendToQueue(userDto: UserDto) {
  try {
    const message = JSON.stringify(userDto);
    channel?.sendToQueue(queueName, Buffer.from(message));
    channel?.consume(queueName, (msg) => {
      if (msg) {
        console.log('Message received from queue:', msg.content.toString());
      }
    }
  )
  } catch (error) {
    console.error('Error sending message to queue:', error);
  }
}

export async function consumeFromQueue(): Promise<UserDto> {
  return new Promise<UserDto>((resolve, reject) => {
    try {
      if (!channel) {
        throw new Error('Channel not initialized');
      }
      channel.consume(queueName, (msg) => {
        if (msg !== null) {
          const msgContent = msg.content.toString();
          console.log(msgContent);
          const data = JSON.parse(msgContent) as UserDto; 
          console.log('Message received:', data);
          resolve(data);
        }
      }, { noAck: true });
    } catch (error) {
      console.error('Error consuming message from queue:', error);
      reject(error); 
    }
  });
}



