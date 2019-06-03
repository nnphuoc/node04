import BaseRepository from './base-repository';

module.exports = {
    userRepository: new BaseRepository('User'),
    groupRepository: new BaseRepository('Group'),
    messageRepository: new BaseRepository('Message')
};