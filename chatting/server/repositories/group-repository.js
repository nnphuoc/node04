import BaseRepository from './base-repository';
import Group from '../models/group';

module.exports = class GroupRepository extends BaseRepository {
    constructor() {
		super(Group);
	}
}