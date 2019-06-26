import BaseRepository from './base-repository';
import User from '../models/user';
import Group from '../models/group';
import Message from '../models/message';
import City from '../models/city';

module.exports = {
    userRepository: new BaseRepository(User),
    groupRepository: new BaseRepository(Group),
    cityRepository: new BaseRepository(City),
    messageRepository: new BaseRepository(Message)
};