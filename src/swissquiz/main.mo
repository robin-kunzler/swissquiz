import AssocList "mo:base/AssocList";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Prelude "mo:base/Prelude";

type List<V> = List.List<V>;
type AssocList<K,V> = AssocList.AssocList<K,V>;

type GameId = {
    id: Nat;
};

type Answer = {
    answer_text: Text; 
    answer_id: AnswerId; 
};

type AnswerId = {
    #A; #B; #C; #D;
};

type QuestionWithAnswerChoices = {
    question_text: Text; 
    answer_A: Answer; 
    answer_B: Answer; 
    answer_C: Answer; 
    answer_D: Answer; 
};

type Question = {
    question_with_answer_choices: QuestionWithAnswerChoices;
    answer: AnswerId;
};

type AnswerResult = {
    correct: Bool;
    correct_answer: AnswerId; 
    game_ended: Bool; 
};

type QuestionId = {
    id: Nat;
};

type Score = {
    num_questions: Nat;
    num_correct_answers: Nat;
};

// Question Definitions

func question(text: Text, answer_1: Text, answer_2: Text, answer_3: Text, answer_4: Text, answer_id: AnswerId) : Question {
    {
        question_with_answer_choices = {
            question_text = text;
            answer_A = {
                answer_text = answer_1;
                answer_id = #A; 
            }; 
            answer_B = {
                answer_text = answer_2;
                answer_id = #B; 
            }; 
            answer_C = {
                answer_text = answer_3;
                answer_id = #C; 
            }; 
            answer_D = {
                answer_text = answer_4;
                answer_id = #D; 
            }; 
        };
        answer = answer_id;
    }
};

var question_1: Question = question(
    "Who is \"Globi\"?", 
    "A Federal Council member", 
    "A nickname for a global leader", 
    "A Swiss cartoon character",
    "The Swiss version of Santa", 
    #C);

var question_2: Question = question(
    "According to rumors, over what are you walking when you cross the Paradeplatz in Zurich?", 
    "Over a part of the Roman \"Limes\"", 
    "Over tons of pure gold", 
    "Over the grave of the Zurich Reformer Ulrich Zwingli",
    "Over one of Dfinity's data centers", 
    #B);

var question_3: Question = question(
    "How many Cantons does Switzerland have?", 
    "7", 
    "24", 
    "26",
    "31", 
    #C);

var question_4: Question = question(
    "What are the official languages in Switzerland?", 
    "German", 
    "German, English", 
    "German, French, Italian",
    "German, French, Italian, Romansh", 
    #D);

var question_5: Question = question(
    "Since when have there been nationwide voting rights for women in Switzerland?", 
    "1887", 
    "1901", 
    "1968",
    "1990", 
    #D);

var question_6: Question = question(
    "What is the largest lake that lies entirely within Switzerland?", 
    "Lake Neuchatel", 
    "Lake Constance (Bodensee)", 
    "Lake of Geneva",
    "Lake Zurich", 
    #A);

var question_7: Question = question(
    "What is the 'Röstigraben'?", 
    "A rampart erected in 1527 by the Papal Swiss Guard to protect the Pope from the troops of Karl V", 
    "A dent for the sauce in the traditional potato dish Rösti", 
    "A humorous term used to refer to the cultural boundary between German-speaking and French-speaking parts of Switzerland.",
    "A ditch for the sauce in the traditional potato dish Rösti. The sauce flows off the plate on both ends of the ditch.", 
    #C);

var question_8: Question = question(
    "In the Swiss Federal Council (German: \"Bundesrat\"):", 
    "All parties are represented", 
    "Only three parties are allowed", 
    "Most Federal Councils are not members of a party",
    "At least 3 out of the 7 members must be women", 
    #A);

var question_9: Question = question(
    "Which invention was not made in Switzerland? ", 
    "LSD (Lysergic acid diethylamide)", 
    "Chocolate", 
    "Potato peeler",
    "Ricola (cough drops / candy made from Swiss herbs)", 
    #B);

var question_10: Question = question(
    "The Swiss national hero Wilhelm Tell:", 
    "actually never lived", 
    "is the founder of the Swiss state", 
    "shot the Zurich bailiff named Gessler",
    "still lives today", 
    #A);
var questions: AssocList<QuestionId, Question> = List.fromArray([
    ({id = 1}, question_1 ),
    ({id = 2}, question_2 ),
    ({id = 3}, question_3 ),
    ({id = 4}, question_4 ),
    ({id = 5}, question_5 ),
    ({id = 6}, question_6 ),
    ({id = 7}, question_7 ),
    ({id = 8}, question_8 ),
    ({id = 9}, question_9 ),
    ({id = 10}, question_10 ),
]);
var static_selected_questions : List<QuestionId> = List.fromArray([
    {id = 1},
    {id = 2}, 
    {id = 3}, 
    {id = 4}, 
    {id = 5}, 
    {id = 6}, 
    {id = 7}, 
    {id = 8}, 
    {id = 9}, 
    {id = 10}
]);

// Game Implementation and Actor

class Game (player_name: Text,
  selected_questions: List<QuestionId>) {
    var cur_selected_question_index = 0;
    var total_num_answers = 0;
    var total_num_correct_answers = 0;
    var ended = false; 

    public func current_question(): QuestionWithAnswerChoices {
        let cur_question_id: QuestionId = Option.unwrap(List.nth(selected_questions, cur_selected_question_index));
        let question: Question = Option.unwrap(AssocList.find(questions, cur_question_id, question_id_eq));
        question.question_with_answer_choices
    };

    public func answer_question(answer_id: AnswerId): AnswerResult {
        let cur_question_id: QuestionId = Option.unwrap(List.nth(selected_questions, cur_selected_question_index));
        let question: Question = Option.unwrap(AssocList.find(questions, cur_question_id, question_id_eq));
        let question_was_correct: Bool = eqAnswerId(question.answer, answer_id);    
        if (question_was_correct and not ended) {
            total_num_correct_answers += 1;
        };
        if (not ended) {
            total_num_answers += 1;
        };
        ended := (cur_selected_question_index + 1) >= List.len(selected_questions);
        if (not ended) {
            cur_selected_question_index += 1;
        };
        {
            correct = question_was_correct;
            correct_answer = question.answer;
            game_ended = ended; 
        }
    };

    // returns the current score, even during the game!
    public func get_result() : Score {
        { 
            num_questions = total_num_answers;
            num_correct_answers = total_num_correct_answers;
        }
    };

    func question_id_eq(first: QuestionId, second: QuestionId) : Bool {
        first.id == second.id
    };

    func eqAnswerId(a1: AnswerId, a2: AnswerId): Bool {
        switch (a1, a2) {
            case (#A, #A) true;
            case (#B, #B) true;
            case (#C, #C) true;
            case (#D, #D) true;
            case _ false;
        }
    };
};

var games: AssocList<GameId, Game> = List.nil();
var game_id_counter: Nat = 0;

actor {
    public func start_game(player_name : Text) : async GameId {
        game_id_counter += 1;
        // For now, we allow multiple games for the same player name. 
        let game = Game(player_name, static_selected_questions);
        let game_id : GameId = {
		    id = game_id_counter;
	    };
        games := List.push((game_id, game), games);
        game_id
    };

    public query func current_question(game_id: GameId) : async QuestionWithAnswerChoices {
        let game: Game = Option.unwrap(AssocList.find(games, game_id, game_id_eq));
        game.current_question()
    };

    public func answer_question(game_id: GameId, answer: AnswerId): async AnswerResult {
        let game: Game = Option.unwrap(AssocList.find(games, game_id, game_id_eq));
        game.answer_question(answer)
    };

    public query func get_result(game_id: GameId) : async Score {
        let game: Game = Option.unwrap(AssocList.find(games, game_id, game_id_eq));
        game.get_result()
    };

    public func greet(name : Text) : async Text {
        return "Hello, " # name # "!";
    };

    func game_id_eq(first: GameId, second: GameId) : Bool {
        first.id == second.id
    };
};