import { Server } from 'http';
import app from './app';
import config from './config';
import { connectRedis } from './shared/redis/client';
import { initSocket } from './shared/socket';

async function bootstrap() {
  const server: Server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });

  // Initialize Socket.io
  initSocket(server);

  // Connect Redis
  await connectRedis();

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error: unknown) => {
    console.error(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}

bootstrap();
