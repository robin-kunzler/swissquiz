import AssocList "mo:base/AssocList";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Nat "mo:base/Nat";

type List<V> = List.List<V>;
type HashMap<K,V> = HashMap.HashMap<K,V>;
type AssocList<K,V> = AssocList.AssocList<K,V>;

type GameId = {
    id: Nat;
};

type Answer = {
    #A; #B; #C; #D;
};

type Question = {
    question_text: Text; 
    answers: HashMap<Answer, Text>;
};

type QuestionId = Nat;

type Game = { // TODO: is it possible to implement functions directly on Game?? 
  user_id: Text;
  next_question_index: Nat; 
  questions: List<QuestionId>;
};

var game_id_counter: Nat = 0;

actor {
    public func start_game(player_name : Text) : async GameId {
        game_id_counter += 1;
        let game_id : GameId = {
		    id = game_id_counter;
	    };
        game_id
    };

    public func greet(name : Text) : async Text {
        return "Hello, " # name # "!";
    };

};