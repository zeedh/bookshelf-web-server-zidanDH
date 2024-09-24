const books = require('./books');
const { nanoid } = require('nanoid');

//Menambahkan Buku (POST)
const addbookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
   
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
   
    const newBook = {
      id, name, year, author, summary, publisher, pageCount, readPage, finished:pageCount===readPage, reading, insertedAt, updatedAt,
    };

    if(!name) {
        const response = h.response ({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(400);
        return response;
    }
    if(readPage > pageCount) {
        const response = h.response ({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        })
        response.code(400);
        return response;
    }
   
    books.push(newBook);
   
    const isSuccess = books.filter((book) => book.id === id).length > 0;
   
    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  };

  //Menampilkan Seluruh Buku (GET)
  const getAllbooksHandler = (request, h) => {
    if(books.length === 0 ){
        return h.response({
            status: 'success',
            data: {
                books: []
            }
        }).code(200)
    }

    const allbooks = books.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
    }));
    return h.response({
        status: 'success',
        data: {
            books: allbooks
        }
    }).code(200);
    
  };

  //Menampilkan Buku Spesifik (GET)
  const getbookByIdHandler = (request, h) => {
    const { id } = request.params;
   
    const book = books.filter((n) => n.id === id)[0];
   
    if (book !== undefined) {
        return h.response({
            status: 'success',
            data: {
                book
            }
        }).code(200);
    };
   
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  };

  //Mengubah Data Buku (PUT)
  const editbookByIdHandler = (request, h) => {
    const { id } = request.params;
   
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();
   
    const index = books.findIndex((book) => book.id === id);
    if(!name){
        const response = h.response({
            status: 'fail',
            "message": "Gagal memperbarui buku. Mohon isi nama buku"
        })
        response.code(400);
        return response;
    }
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400);
        return response;
    }
    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
      };
   
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });
      response.code(404);
      return response;
  };

  //Menghapus Buku (DELETE)
  const deletebookByIdHandler = (request, h) => {
    const { id } = request.params;
   
    const index = books.findIndex((book) => book.id === id);
   
    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }
   
   const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  };

   
  module.exports = {
    addbookHandler,
    getAllbooksHandler,
    getbookByIdHandler,
    editbookByIdHandler,
    deletebookByIdHandler
  };
