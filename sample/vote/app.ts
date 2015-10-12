import {MongodbDriver} from "../../src/driver/MongodbDriver";
import {ConnectionManager} from "../../src/connection/ConnectionManager";
import {Repository} from "../../src/repository/Repository";
import {Vote} from "./document/Vote";
import {VoteInfo} from "./document/VoteInfo";
import {VoteInfoData} from "./document/VoteInfoData";
import {VoteResult} from "./document/VoteResult";
import {VoteAnswer} from "./document/VoteAnswer";
import {Author} from "./document/Author";
import {Tag} from "./document/Tag";
import {CascadeOptionUtils} from "../../src/repository/cascade/CascadeOptionUtils";

//let typeOdmConnectionManager: ConnectionManager = Container.get(ConnectionManager);
let mongodbConnectionManager: ConnectionManager = new ConnectionManager();
mongodbConnectionManager.addConnection(new MongodbDriver());
mongodbConnectionManager.importDocumentsFromDirectories([__dirname + '/document']);
mongodbConnectionManager.importSubscribersFromDirectories([__dirname + '/subscriber']);
mongodbConnectionManager.getConnection().connect({
    url: 'mongodb://localhost:27017/typeodm-samples'
}).then(connection => {
    console.log('Connection to mongodb is established');

    let voteRepository = connection.getRepository<Vote>(Vote);

    let vote = new Vote();
    vote.title = 'Which president you choose?';
    vote.description = 'Vote or die!';
    voteRepository.persist(vote/*, cascades*/).then(savedVote => {
       // console.log('Vote is saved:', savedVote);

        // now remove vote answer from it: answer should also be removed.
        vote.information = null;
        vote.answers.splice(0, 1);

        console.log(vote);

        return voteRepository.persist(savedVote);

    }).then(savedVote => {
        console.log('Vote is updated:', savedVote);

    }, e => console.log(e));

    /*let voteAnswerRepository = connection.getRepository<VoteAnswer>(VoteAnswer);
     let result1 = new VoteResult();
     result1.counter++;

     let answer = new VoteAnswer();
     answer.results.push(result1);

     voteAnswerRepository.persist(answer)
     .then(q => console.log(q), e => console.log(e));*/

   /* let author = new QuestionAuthorDocument();
    author.name = 'Umed';

    let tag1 = new QuestionTagDocument();
    tag1.name = 'games';
    tag1['bbbb'] = 'games';
    let tag2 = new QuestionTagDocument();
    tag2.name = 'programming';
    tag2['aaaa'] = 'programming';

    let question = new QuestionDocument();
    question.title = '����� ���� �����?';
    question.description = '������� ����� ���� �����?';
    question.author = author;
    question.tags.push(tag1, tag2);*/

    /*let questionAnswer1 = new QuestionAnswerDocument();
    questionAnswer1.text = '����� ��� i5';

    let question = new QuestionDocument();
    question.title = '����� ���� �����?';
    question.description = '������� ����� ���� �����?';
    questionAnswer1.question = question;

    questionAnswerRepository.persist(questionAnswer1)
        .then(q => console.log(q), e => console.log(e));*/

   /* let question = new QuestionDocument();
    question.title = '����� ���� �����?';
    question.description = '������� ����� ���� �����?';
    questionAnswer1.question = question;*/

   /* let question;
    questionRepository.findById('55f3d54521260940242ebf7e').then(q => {
        question = q;
        return questionAnswerRepository.findById('55f3da45d5a5e81827f9e901');
    }).then(answer => {

        answer.text = 'Wow';
        answer.question = question;

        questionAnswerRepository
            .persist(answer)
            .then(q => console.log(q), e => console.log(e));

    });*/

    /*let question = new QuestionDocument();
    question.title = 'Where are';
    question.description = 'Where are we now?';*/

   /* let information = new QuestionInformationDocument();*/
    /*questionInformationRepository.findById('55f2eacb2261e9f02571a534').then(information => {

        information.name = 'where we are';
        information.question = question;

        questionInformationRepository
            .persist(information)
            .then(q => console.log(q), e => console.log(e));

    });*/

    /*let questionAnswerRepository = connection.getRepository<QuestionAnswerDocument>(QuestionAnswerDocument);
    //questionAnswerRepository.

    let repository = connection.getRepository<QuestionDocument>(QuestionDocument);
    //repository.findById('55e56037b49c2ae423af3e91').then(question => console.log(question));

    let questionAnswer1 = new QuestionAnswerDocument();
    questionAnswer1.text = '����� ��� i5';

    let questionAnswer2 = new QuestionAnswerDocument();
    questionAnswer2.text = '����� ��� i7';

    let questionAnswer3 = new QuestionAnswerDocument();
    questionAnswer3.text = '����� ��� i3';

    let questionAnswer4 = new QuestionAnswerDocument();
    questionAnswer4.text = '����� ��� atom';

    let question = repository.create();
    question.title = '����� ���� �����?';
    question.description = '������� ����� ���� �����?';
    question.answers.push(questionAnswer1);
    question.answers.push(questionAnswer2);
    question.answers.push(questionAnswer3);
    question.answers.push(questionAnswer4);

    let author = new QuestionAuthorDocument();
    author.name = 'Umed';
    question.author = author;

    let information = new QuestionInformationDocument();
    information.name = 'info about the question';
    question.information = information;

    repository.insert(question).then(q => console.log(q), e => console.log(e));*/

    /*repository.findById('55e85eedadac61ec18d504f0', question => [
        {
            field: question.author,
            condition: {
                name: 'Umed'
            }
        },
        {
            field: question.answers,
            join: (questionAnswer: QuestionAnswerDocument) => [{
                field: questionAnswer.author,
                inner: true,
                condition: {
                    name: 'Umed'
                }
            }],
            condition: {
                text: 'i5'
            }
        }
    ])

    .then(question => console.log(question), e => console.log(e));*/



   /* return;

    repository.findById('55e85eedadac61ec18d504f0', q => [
        {
            field: q.author,
            condition: {
                name: 'Umed'
            }
        },
        {
            field: q.answers,
            inner: false,
            join: (questionAnswer: QuestionAnswerDocument) => [{
                field: questionAnswer.author,
                inner: false,
                condition: {
                    name: 'Umed!'
                }
            }],
            condition: {
                text: 'i5'
            }
        }
    ])
        .then(q => console.log(q), e => console.log(e));

    return;

















    // let repository: Repository<QuestionDocument> = connection.getRepository<QuestionAnswerDocument>(QuestionAnswerDocument);
    //let repository = new Repository<QuestionDocument>(null, null);
    /*let questionAnswer = new QuestionAnswerDocument();
    questionAnswer.text = 'Yo ho ho ho ';

    let author = new QuestionAuthorDocument();
    author.name = 'Umed';
    author['zuma'] = 'Zumachka';

    let tag1 = new QuestionTagDocument();
    tag1.name = 'games';
    tag1['bbbb'] = 'games';
    let tag2 = new QuestionTagDocument();
    tag2.name = 'programming';
    tag2['aaaa'] = 'programming';

    let question = repository.create();
    question.title = 'Hello world';
    question.description = 'I am rock and I am superman!';
    question.answers.push(questionAnswer);
    question.tags.push(tag1);
    question.tags.push(tag2);
    question.author = author;
    question['title2'] = 'qweqw';
    repository.insert(question).then(x => console.log(x));

    repository.findOne({ title: 'Hello world' }).then(q => console.log(q));
   // repository.find({ title: 'Hello world' }).then(q => console.log(q));

    /*repository.findById('55e55444541632600240aae6').then(q => {
        q.title ='lalalla';
        return repository.replace(q);
    }).then(r => { console.log(r); });*/

    /*repository.findById('55e55444541632600240aae6').then(q => {
        return repository.update(q, { $set: { title: 'WOW!z'} }).then(x => console.log(x));
    }).then(r => { console.log(r); });*/

    // repository.updateByConditions({ title: 'WOW!z' }, {  $set: { title: 'WOW!Z'} })
    /*repository.findById('55e55444541632600240aae6').then(q => {
        return repository.remove(q);
    });*/
    //repository.removeById('55e55ff755c1dae418848f5a');


}).catch(e => console.log('Error during connection to mongodb: ' + e));
