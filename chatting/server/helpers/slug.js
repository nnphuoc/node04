'use strict';
export default class Slug {

    static parseSlug(name) {
        return name.normalize('NFD')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D')
            .toLowerCase();
    }
};
