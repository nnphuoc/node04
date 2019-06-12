import BaseRepository from './base-repository';
import User from '../models/user';
import Group from '../models/group';
import Message from '../models/message';

module.exports = {
    userRepository: new BaseRepository(User),
    groupRepository: new BaseRepository(Group),
    messageRepository: new BaseRepository(Message)
};