import 'dart:convert';
import 'dart:io';
import 'package:evaluateai/providers/user.dart';
import 'package:evaluateai/screens/home.dart';
import 'package:evaluateai/utils/utils.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';
import 'package:uploadthing/uploadthing.dart';

import '../utils/api.dart';

class EvaluatorProvider extends ChangeNotifier {
  bool loading = false;
  List evaluators = [];
  Map evaluatorData = {};
  String selectedEvaluatorId = "";
  Map evaluationData = {"hasErrors": false};

  bool evaluating = false;
  Future<void> evaluate() async {
    evaluating = true;
    notifyListeners();

    var response = await Server.post("/evaluators/evaluate-all", {
      "evaluatorId": selectedEvaluatorId,
    });

    if (response.statusCode == 200) {
      Fluttertoast.showToast(msg: "Evaluation started");
      getEvaluation();
    } else {
      evaluating = false;
      notifyListeners();
    }
  }

  Future<void> getEvaluation() async {
    loading = true;

    var response = await Server.post("/evaluators/poll-evaluation", {
      "evaluatorId": selectedEvaluatorId,
    });

    if (response.statusCode == 200) {
      loading = false;

      evaluationData = jsonDecode(response.body);
      notifyListeners();

      if (evaluationData["isCompleted"]) {
        if (evaluating == true) {
          if (!evaluationData["hasErrors"]) {
            Fluttertoast.showToast(
                msg: "Evaluation completed. Check 🏆 Results");
          } else {
            Fluttertoast.showToast(msg: "Some error occured. Check Errors");
          }
        }
        evaluating = false;
        Provider.of<UserProvider>(Get.context!).getLimits();
        notifyListeners();
      } else {
        Future.delayed(Duration(seconds: 1), () {
          getEvaluation();
        });
      }
    }
  }

  Future<void> getEvaluators() async {
    loading = true;

    var response = await Server.get("/evaluators");

    if (response.statusCode == 200) {
      loading = false;

      evaluators = jsonDecode(response.body)["evaluators"];
      notifyListeners();
    }
  }

  Future<void> createEvaluator(
      String title, String description, String classId) async {
    loading = true;
    notifyListeners();

    var response = await Server.post("/evaluators/new", {
      "title": title,
      "description": description,
      "classId": classId,
    });

    loading = false;
    notifyListeners();

    if (response.statusCode == 200) {
      Fluttertoast.showToast(msg: "Evaluator created");
      getEvaluators();
    } else {
      Fluttertoast.showToast(msg: "Failed to create evaluator");
    }
  }

  Future<void> updateEvaluator(
      String title, String description, String classId) async {
    loading = true;
    notifyListeners();

    var response = await Server.post("/evaluators/save", {
      "evaluatorId": selectedEvaluatorId,
      "title": title,
      "description": description,
      "classId": classId,
      "questionPapers": evaluatorData["questionPapers"],
      "answerKeys": evaluatorData["answerKeys"],
      "answerSheets": evaluatorData["answerSheets"],
      "extraPrompt": evaluatorData["extraPrompt"],
      "totalMarks": evaluatorData["totalMarks"],
    });

    loading = false;
    notifyListeners();

    if (response.statusCode == 200) {
      Fluttertoast.showToast(msg: "Evaluator saved");
      getEvaluators();
    } else {
      Fluttertoast.showToast(msg: "Failed to save evaluator");
    }
  }

  Future<void> deleteEvaluator() async {
    loading = true;
    notifyListeners();

    var response = await Server.post("/evaluators/delete", {
      "evaluatorId": selectedEvaluatorId,
    });

    loading = false;
    notifyListeners();

    if (response.statusCode == 200) {
      Fluttertoast.showToast(msg: "Evaluator deleted");
      getEvaluators();
      Get.offAll(() => HomeScreen());
    } else {
      Fluttertoast.showToast(msg: "Failed to delete evaluator");
    }
  }

  void selectEvaluator(String evaluatorId) {
    selectedEvaluatorId = evaluatorId;
    notifyListeners();
  }

  Future<void> getEvaluator() async {
    loading = true;

    var response = await Server.post("/evaluators/by-id", {
      "evaluatorId": selectedEvaluatorId,
    });

    if (response.statusCode == 200) {
      loading = false;

      evaluatorData = jsonDecode(response.body);
      getEvaluation();
      notifyListeners();
    }
  }

  void removeQuestionPaper(int index) {
    evaluatorData["questionPapers"].removeAt(index);
    updateEvaluator(evaluatorData["title"], evaluatorData["description"],
        evaluatorData["classId"]["_id"]);
    notifyListeners();
  }

  void removeAnswerKey(int index) {
    evaluatorData["answerKeys"].removeAt(index);
    updateEvaluator(evaluatorData["title"], evaluatorData["description"],
        evaluatorData["classId"]["_id"]);
    notifyListeners();
  }

  void removeAnswerSheet(int index, int i) {
    evaluatorData["answerSheets"][index]["answerSheets"].removeAt(i);
    updateEvaluator(evaluatorData["title"], evaluatorData["description"],
        evaluatorData["classId"]["_id"]);
    notifyListeners();
  }

  bool uploadingQuestionPapers = false;
  void addQuestionPapers(List<File> files) async {
    uploadingQuestionPapers = true;
    notifyListeners();
    UploadThing uploadThing = UploadThing(uploadthingSecret);
    await uploadThing.uploadFiles(files);
    for (var i = 0; i < uploadThing.uploadedFilesData.length; i++) {
      evaluatorData["questionPapers"]
          .add(uploadThing.uploadedFilesData[i]["url"]);
    }
    Future.delayed(Duration(seconds: 1), () {
      updateEvaluator(evaluatorData["title"], evaluatorData["description"],
          evaluatorData["classId"]["_id"]);
      uploadingQuestionPapers = false;
      notifyListeners();
    });
  }

  bool uploadingAnswerKeys = false;
  void addAnswerKeys(List<File> files) async {
    uploadingAnswerKeys = true;
    notifyListeners();
    UploadThing uploadThing = UploadThing(uploadthingSecret);
    await uploadThing.uploadFiles(files);
    for (var i = 0; i < uploadThing.uploadedFilesData.length; i++) {
      evaluatorData["answerKeys"].add(uploadThing.uploadedFilesData[i]["url"]);
    }
    Future.delayed(Duration(seconds: 1), () {
      updateEvaluator(evaluatorData["title"], evaluatorData["description"],
          evaluatorData["classId"]["_id"]);
      uploadingAnswerKeys = false;
      notifyListeners();
    });
  }

  bool uploadingAnswerSheets = false;
  void addAnswerSheets(int index, List<File> files) async {
    uploadingAnswerSheets = true;
    notifyListeners();
    UploadThing uploadThing = UploadThing(uploadthingSecret);
    await uploadThing.uploadFiles(files);
    for (var i = 0; i < uploadThing.uploadedFilesData.length; i++) {
      evaluatorData["answerSheets"][index]["answerSheets"]
          .add(uploadThing.uploadedFilesData[i]["url"]);
    }
    Future.delayed(Duration(seconds: 1), () {
      updateEvaluator(evaluatorData["title"], evaluatorData["description"],
          evaluatorData["classId"]["_id"]);
      uploadingAnswerSheets = false;
      notifyListeners();
    });
  }
}
