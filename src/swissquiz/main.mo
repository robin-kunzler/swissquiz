import AssocList "mo:base/AssocList";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";
import Option "mo:base/Option";

type List<V> = List.List<V>;
type HashMap<K,V> = HashMap.HashMap<K,V>;
type AssocList<K,V> = AssocList.AssocList<K,V>;
type Hash = Hash.Hash;

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

type Question = {
    question_text: Text; 
    answer_A: Answer; 
    answer_B: Answer; 
    answer_C: Answer; 
    answer_D: Answer; 
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

func question(text: Text, answer_1: Text, answer_2: Text, answer_3: Text, answer_4: Text) : Question {
    {
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
    }
};

var question_1: Question = question("Who is Globi?", "an elephant", "a penguin", "a parrot","a coelacanth");

var questions: AssocList<QuestionId, Question> = List.fromArray<(QuestionId, Question)>([
        ({id = 1}, question_1 ),
    ]);
var static_selected_questions : List<QuestionId> = List.fromArray<QuestionId>([{id = 1}]);

// Game Implementation and Actor

class Game (player_name: Text,
  selected_questions: List<QuestionId>) {
    var cur_selected_question_index = 0;

    // returns the text of the current question
    public func current_question(): Question {
        let cur_question_id: QuestionId = 
            Option.unwrap<QuestionId>(
                List.nth<QuestionId>(selected_questions, cur_selected_question_index)
            );
        Option.unwrap<Question>(
            AssocList.find<QuestionId, Question>(questions, cur_question_id, question_id_eq)
        )
    };

    func question_id_eq(first: QuestionId, second: QuestionId) : Bool {
        first.id == second.id
    };
};

var games: AssocList<GameId, Game> = List.nil<(GameId, Game)>();
var game_id_counter: Nat = 0;

actor {
    public func start_game(player_name : Text) : async GameId {
        game_id_counter += 1;
        // For now, we allow multiple games for the same player name. 
        var game = Game(player_name, static_selected_questions);
        let game_id : GameId = {
		    id = game_id_counter;
	    };
        games := List.push<(GameId, Game)>((game_id, game), games);
        game_id
    };

    public query func current_question(game_id: GameId) : async Question {
        var game: Game = Option.unwrap<Game>(AssocList.find<GameId, Game>(games, game_id,game_id_eq ));
        game.current_question()
    };

    public func answer_question(game_id: GameId, answer: AnswerId): async AnswerResult {
        // TODO: implement answer_question
        {
            correct = true;
            correct_answer = {#B};
            game_ended = false; 
        }
    };

    public func get_result(game_id: GameId) : async Score {
        // TODO: implement get_result
        { 
            num_questions = 1;
            num_correct_answers = 1;
        }
    };


    public func greet(name : Text) : async Text {
        return "Hello, " # name # "!";
    };

    func game_id_eq(first: GameId, second: GameId) : Bool {
        first.id == second.id
    };

};