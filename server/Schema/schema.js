const graphql = require('graphql');
const Book = require('../Model/Book');
const Author = require('../Model/Author');

//describe a object type on each data in a graph
const { 
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      async resolve(parent,args){
        return await Author.findById(parent.authorID);
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent,args){
        return await Book.find({ authorID: parent.id });
      }
    }
  })
});

//define a root query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        //get data from db/other source
        return await Book.findById(args.id); 
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      async resolve(parent,args) {
        return await Author.findById(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent,args){
        return await Book.find({});
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      async resolve(parent,args){
        return await Author.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name:'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString)},
        age: { type: new GraphQLNonNull(GraphQLInt)}
      },
      async resolve(parent,args){
        const { name,age } = args;
        let author = new Author({
          name,
          age
        });

        return await author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString)},
        genre: { type: new GraphQLNonNull(GraphQLString)},
        authorID: { type: new GraphQLNonNull(GraphQLID)}
      },
      async resolve(parent,args){
        const { name, genre, authorID } = args;
        let book = new Book({
          name,
          genre,
          authorID
        });

        return await book.save();
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});