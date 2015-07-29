for (var i = 0; i < 2000; i++) {
    if (i % 2 == 0) {
        db.sourceData.insert({
                "id": i,
                "name": "Kshitij" + i,
                "email": "abc" + i,
                "work": "Google" + i,
                "dob": i / 12,
                "age": i + 10,
                "gender": "male",
                "salary": i + 100,
                "hobbies": "ABC" + i
            }

        );

    } else {

        db.sourceData.insert({
                "id": i,
                "name": "Kshitij" + i,
                "email": "abc" + i,
                "work": "Google" + i,
                "dob": i / 12,
                "age": i + 10,
                "gender": "female",
                "salary": i + 100,
                "hobbies": "ABC" + i
            }

        );
    }

}