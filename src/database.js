import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'

const adapter = new LocalStorage('db')
const db = low(adapter)

const projects = []

const alarm = []

db.defaults({
    projects,
    alarm
}).write()

export const setDB = (name, value) => {
    db.set(name, value).write()
}

export const getDB = name => db.get(name).cloneDeep().value()

export const addDB = (name, value) => {
    db.get(name).unshift(value).write()
}
