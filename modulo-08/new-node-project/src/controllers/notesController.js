const knex = require('../database/knex')

class NotesController{
    async create(req, res){
        const { title, description, tags, links } = req.body
        const { user_id } = req.params 
        
        const [note_id] = await knex("notes").insert({
            title,
            description,
            user_id
        })

        const linksInsert = links.map(link =>{
            return{
                note_id,
                url: link
            }
        })

        await knex("links").insert(linksInsert)

        const tagsInsert = tags.map(name =>{
            return{
                note_id,
                name,
                user_id
            }
        })

        await knex("tags").insert(tagsInsert)

        res.json()
    }

    async show(req, res){
        const { id } = req.params

        const note = await knex("notes").where({ id }).first()
        const tags = await knex("tags").where({ note_id: id}).orderBy("name")
        const links = await knex("links").where({ note_id: id}).orderBy("created_at")
    
        return res.json({
            ...note,
            tags,
            links
        })
    }

    async delete(req, res){
        const { id } = req.params

        await knex("notes").where({ id }).delete()

        return res.json()
    }

    async index(req, res){
        const { title, id, tags } = req.query

        let note

        if(tags){
            const filterTags = tags.split(',').map(tag => tag.trim())

            note = await knex("tags")
            .select([
                "notes.id",
                "notes.title",
                "notes.user_id"
            ])
            .where("notes.user_id", id)
            .whereLike("title", `%${title}%`)
            .whereIn("name", filterTags)
            .innerJoin("notes", "notes.id", "tags.note_id")
            .orderBy("title")

            return res.json(note)
        }else{
            note = await knex("notes")
            .where({ user_id: id })
            .whereLike( "title", `%${title}%`)
            .orderBy("title")

            const userTags = await knex("tags").where({ user_id: id })
            const notesWithTags = note.map(note =>{
                const noteTag = userTags.filter(tag => tag.note_id === note.id)
            
                return {
                    ...note,
                    tags: noteTag
                }
            })
    
            return res.json(notesWithTags)
        }
    }
}

module.exports = NotesController