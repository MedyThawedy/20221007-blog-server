import express from 'express';
import cors from 'cors';
import multer from 'multer';
import morgan from 'morgan';
import fs from 'fs';

const PORT = 5000
const app = express()

const upload = multer({dest: './public'})

app.use(morgan('dev'))
app.use('/public', express.static('public'))
app.use(cors())

//Show all articles from 'articles.json'
app.get('/articles', (req,res) => {
   return new Promise((resolve, reject) => {
        fs.readFile('articles.json', (err, data) => {
            if(err)
                reject(err)
            else    
                resolve(data)
        })
    }).then( data => res.status(200).json(JSON.parse(data)))
    .catch( err => {
        console.log(err)
        res.status(500).end()
    })
}
)

app.get('/details/:id', async(req,res)=>{
    console.log(req.params.id)
    return new Promise((resolve, reject) => {
        fs.readFile('articles.json', (err, data) => {
            if(err)
                reject(err)
            else    
                resolve(data)
        })
    }).then( data =>{ 
       // console.log('Hier Test ',  JSON.parse(data).find(item => item.id === '45f5c0dc'));
        res.status(200).json(JSON.parse(data).find(item => item.id == `${req.params.id}`));
    } 
       
        )
    .catch( err => {
        console.log(err)
        res.status(500).end()
    })
})

// Add new article in 'articles.json'
app.post('/articles', upload.single('articlepicture'),
    (req,res)=>{
        const article = {
            id:req.body.id,
            articletitle: req.body.articletitle,
            articlepicture: req.file.path,
            articletext:req.body.articletext
        }
        return new Promise((resolve, reject) => {
            fs.readFile('articles.json', (err, data) => {
                if(err)
                    reject(err)
                else    
                    resolve(data)
            })
        })
        .then(data => JSON.parse(data))
        .then(obj => {
            obj.push(article)
            return new Promise((resolve, reject) => {
                fs.writeFile('articles.json', JSON.stringify(obj), (err) => {
                    if(err)
                        reject(err)
                    else
                        resolve(true)
                })
            })
            .then( () => res.status(200).end())
            .catch(err => {
                console.log(err)
                res.status(500).end()
            })
        })

    }
)

app.listen(PORT, () => console.log('Server listens on Port:',PORT,' - '));