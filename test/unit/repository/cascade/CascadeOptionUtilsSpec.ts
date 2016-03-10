import * as chai from "chai";
import * as sinon from "sinon";
import {CascadeOptionUtils} from "../../../../src/repository/cascade/CascadeOptionUtils";
import {CascadeOption} from "../../../../src/repository/cascade/CascadeOption";
import SinonSpy = Sinon.SinonSpy;
import {DocumentSchema} from "../../../../src/schema/DocumentSchema";

chai.should();
chai.use(require("sinon-chai"));

describe("CascadeOptionUtils", function() {


    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    let schema: DocumentSchema, schemaSpy: SinonSpy;
    beforeEach(function() {
        schema = <DocumentSchema> {
            createPropertiesMirror: function() {
                return {
                    answers: "answers"
                };
            }
        };
        schemaSpy = sinon.spy(schema, "createPropertiesMirror");
    });

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    it("should correctly create cascade options from first form of dynamic cascade options", function () {
        let cascades1 = {
            answers: {
                insert: true,
                update: true,
                remove: true,
                cascades: {
                    name: {
                        insert: true,
                        update: false,
                        remove: false
                    }
                }
            }
        };
        let cascades2 = {
            questions: {
                insert: false,
                update: true,
                cascades: {
                    date: {
                        insert: false,
                        remove: true
                    }
                }
            },
            votes: {
                insert: true,
                remove: true
            }
        };

        CascadeOptionUtils.prepareCascadeOptions(schema, cascades1).should.be.eql(<CascadeOption[]>[{
            field: "answers",
            insert: true,
            update: true,
            remove: true,
            cascades: [{
                field: "name",
                insert: true,
                update: false,
                remove: false,
                cascades: []
            }]
        }]);

        CascadeOptionUtils.prepareCascadeOptions(schema, cascades2).should.be.eql(<CascadeOption[]>[{
            field: "questions",
            insert: false,
            update: true,
            remove: false,
            cascades: [{
                field: "date",
                insert: false,
                update: false,
                remove: true,
                cascades: []
            }]
        }, {
            field: "votes",
            insert: true,
            update: false,
            remove: true,
            cascades: []
        }]);
    });

    it("should correctly create cascade options from second form of dynamic cascade options", function () {
        let cascades1 = {
            "answers": { insert: true, update: true, remove: true },
            "answers.name": { insert: true, update: false, remove: true },
        };

        CascadeOptionUtils.prepareCascadeOptions(schema, cascades1).should.be.eql(<CascadeOption[]>[{
            field: "answers",
            insert: true,
            update: true,
            remove: true,
            cascades: [{
                field: "name",
                insert: true,
                update: false,
                remove: true,
                cascades: []
            }]
        }]);
        let cascades2 = {
            "answers.name": { insert: true, update: false, remove: false },
            "answers": { insert: false, update: false, remove: true }
        };

        CascadeOptionUtils.prepareCascadeOptions(schema, cascades2).should.be.eql(<CascadeOption[]>[{
            field: "answers",
            insert: false,
            update: false,
            remove: true,
            cascades: [{
                field: "name",
                insert: true,
                update: false,
                remove: false,
                cascades: []
            }]
        }]);
        let cascades3 = {
            "answers": { insert: false, update: false, remove: true },
            "answers.name": { insert: true, update: false, remove: false },
            "answers.name.last": { insert: false, update: false, remove: false },
            "answers.name.first": { insert: true, update: true, remove: true }
        };

        CascadeOptionUtils.prepareCascadeOptions(schema, cascades3).should.be.eql(<CascadeOption[]>[{
            field: "answers",
            insert: false,
            update: false,
            remove: true,
            cascades: [{
                field: "name",
                insert: true,
                update: false,
                remove: false,
                cascades: [{
                    field: "last",
                    insert: false,
                    update: false,
                    remove: false,
                    cascades: []
                }, {
                    field: "first",
                    insert: true,
                    update: true,
                    remove: true,
                    cascades: []
                }]
            }]
        }]);
    });

    it("should correctly create cascade options from third form of dynamic cascade options", function () {

        let cascades: CascadeOption[] = [{
            field: "answers",
            insert: false,
            update: false,
            remove: true,
            cascades: [{
                field: "name",
                insert: true,
                update: false,
                remove: false,
                cascades: [{
                    field: "last",
                    insert: false,
                    update: false,
                    remove: false,
                    cascades: []
                }, {
                    field: "first",
                    insert: true,
                    update: true,
                    remove: true,
                    cascades: []
                }]
            }]
        }];

        CascadeOptionUtils.prepareCascadeOptions(schema, cascades).should.be.equal(cascades);
    });

    it("should correctly create cascade options from forth form of dynamic cascade options", function () {

        let subCascades = (voteAnswer: any) => [{
            field: voteAnswer.results,
            insert: true,
            update: true,
            remove: false
        }];

        let cascades = (vote: any) => [{
             field: vote.answers,
             insert: false,
             update: false,
             remove: false,
             cascades: subCascades
        }];

        CascadeOptionUtils.prepareCascadeOptions(schema, cascades).should.be.eql(<CascadeOption[]>[{
            field: "answers",
            insert: false,
            update: false,
            remove: false,
            cascades: subCascades
        }]);

        // schemaSpy.should.have.been.called();
    });

});
