import HelloCommand from '../../commands/general/hello';

const messageChannelSendMock = jest.fn();

describe('HelloCommand', () => {
  describe('when message has no parameters', () => {
    it('says hello to the user', () => {
      // Mock command before using it
      const botDb = {};
      const helloCommand = new HelloCommand((botDb as unknown) as import('../../bot-db').BotDb);
      const message = {};
      Object.defineProperty(message, 'channel', {
        value: {
          send: messageChannelSendMock,
        },
      });
      Object.defineProperty(message, 'content', { value: '>>hello' });
      Object.defineProperty(message, 'author', { value: '@arnavb' });

      helloCommand.execute((message as unknown) as import('discord.js').Message, []);
      expect(messageChannelSendMock).toBeCalledWith('Hello, @arnavb!');
    });
  });

  describe('when message has one parameter', () => {
    it('says hello to the parameter', () => {
      // Mock command before using it
      const botDb = {};
      const helloCommand = new HelloCommand((botDb as unknown) as import('../../bot-db').BotDb);
      const message = {};
      Object.defineProperty(message, 'channel', {
        value: {
          send: messageChannelSendMock,
        },
      });
      Object.defineProperty(message, 'content', { value: '>>hello there' });

      helloCommand.execute((message as unknown) as import('discord.js').Message, ['there']);
      expect(messageChannelSendMock).toBeCalledWith('Hello, there!');
    });
  });

  describe('when message has one parameter', () => {
    it('says hello to the space separated parameters', () => {
      // Mock command before using it
      const botDb = {};
      const helloCommand = new HelloCommand((botDb as unknown) as import('../../bot-db').BotDb);
      const message = {};
      Object.defineProperty(message, 'channel', {
        value: {
          send: messageChannelSendMock,
        },
      });
      Object.defineProperty(message, 'content', { value: '>>hello over there' });

      helloCommand.execute((message as unknown) as import('discord.js').Message, ['over', 'there']);
      expect(messageChannelSendMock).toBeCalledWith('Hello, over there!');
    });
  });
});
