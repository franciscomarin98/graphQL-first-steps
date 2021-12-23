import {ApolloServer, UserInputError, gql} from 'apollo-server'
import {v1 as uuid} from 'uuid'

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
        phone: "345-456-7890",
        id: "124"
    }
]

const typeDefs = gql`
    type Address {
        street: String!
        city: String!
    }

    type Person {
        id: String,
        name: String!
        phone: String
        address: Address
    }

    type Query {
        peopleCount: Int!
        allPeople: [Person]!
        findPerson(name:String!):Person
    }

    type Mutation{
        addPerson(
            name:String!
            phone:String
            street:String!
            city:String!
        ):Person
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
    },
    Mutation: {
        addPerson: (root, args) => {
            if (persons.find(p=>p.name === args.name)) {
                throw new UserInputError("Name already exists")
            }
            const person = {...args, id: uuid()}
            persons.push(person);
            return person;
        }
    },
    Person: {
        address: (root) => {
            return {
                street: root.street,
                city: root.city
            }
        },
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({url}) => {
    console.log(`Server listening at ${url}`)
});

