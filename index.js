import {ApolloServer, gql} from 'apollo-server'

const persons = [
    {
        name: "Itzi",
        phone: "123-456-7890",
        street: "Calle Fronted",
        city: "New York",
        id: "123"
    },
    {
        name: "Francisco",
        street: "Calle Fronted",
        city: "New York",
        id: "124"
    }
]

const typeDefinitions = gql`
    type Person {
        name: String!
        phone: String
        street: String!,
        city: String,
        id: String
    }

    type Query {
        peopleCount: Int!
        allPeople: [Person]!
        findPerson(name:String!):Person
    }
`

const resolvers = {
    Query: {
        peopleCount: () => persons.length,
        allPeople: () => persons,
        findPerson: (root, args) => {
            const {name} = args;
            return persons.find(person => person.name === name);
        }
    }
}

const server = new ApolloServer({
    typeDefs: typeDefinitions,
    resolvers
})

server.listen().then(({url}) => {
    console.log(`Server listening at ${url}`)
});

