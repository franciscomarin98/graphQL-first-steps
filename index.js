import {ApolloServer, UserInputError, gql} from 'apollo-server'
import {v1 as uuid} from 'uuid'

const persons = [
    {
        name: "Itzi",
        phone: "123-456-7890",
        street: "Calle Fronted",
        city: "New York",
        id: "123-34534-5-34-53-45-"
    },
    {
        name: "Francisco",
        street: "Calle Fronted",
        city: "New York",
        phone: "345-456-7890",
        id: "124-24-23-42-34-2-34"
    },
    {
        name: "Tester",
        street: "Calle Fronted",
        city: "New York",
        id: "124-24-234-2-34-23-4"
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
        allPeople(phone: YesNo): [Person]!
        findPerson(name:String!):Person
    }

    type Mutation{
        addPerson(
            name:String!
            phone:String
            street:String!
            city:String!
        ):Person
        editPhone(name:String!,phone:String!):Person
    }

    enum YesNo {
        YES
        NO
    }


`

const resolvers = {
    Query: {
        peopleCount: () => persons.length,
        allPeople: (root, args) => {
            if (!args.phone) return persons;
            return persons.filter(p => args.phone === 'YES' ? p.phone : !p.phone)
        },
        findPerson: (root, args) => {
            const {name} = args;
            return persons.find(person => person.name === name);
        }
    },
    Mutation: {
        addPerson: (root, args) => {
            if (persons.find(p => p.name === args.name)) {
                throw new UserInputError("Name already exists")
            }
            const person = {...args, id: uuid()}
            persons.push(person);
            return person;
        },
        editPhone: (root, args) => {
            const personIndex = persons.findIndex(p => p.name === args.name);
            if (personIndex === -1) return null;

            const person = persons[personIndex];

            const updatedPerson = {...person, phone: args.phone};
            persons[personIndex] = updatedPerson;

            return updatedPerson
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

