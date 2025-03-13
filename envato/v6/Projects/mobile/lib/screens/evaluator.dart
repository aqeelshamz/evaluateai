import 'dart:io';

import 'package:evaluateai/providers/classes.dart';
import 'package:evaluateai/providers/evaluators.dart';
import 'package:evaluateai/screens/image_view.dart';
import 'package:evaluateai/screens/result.dart';
import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

class EvaluatorScreen extends StatefulWidget {
  final Map evaluator;
  const EvaluatorScreen({super.key, required this.evaluator});

  @override
  State<EvaluatorScreen> createState() => _EvaluatorScreenState();
}

class _EvaluatorScreenState extends State<EvaluatorScreen> {
  @override
  void initState() {
    Provider.of<ClassesProvider>(context, listen: false)
        .getStudents(widget.evaluator['classId']);
    Provider.of<EvaluatorsProvider>(context, listen: false)
        .getEvaluations(widget.evaluator['_id']);
    Provider.of<EvaluatorsProvider>(context, listen: false)
        .getResultsAll(widget.evaluator['_id']);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    var provider = Provider.of<EvaluatorsProvider>(context, listen: true);

    return Scaffold(
      body: SafeArea(
        child: Container(
          padding: const EdgeInsets.all(20),
          width: Get.width,
          height: Get.height,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  IconButton(
                    padding: EdgeInsets.zero,
                    icon: const Icon(FeatherIcons.arrowLeft),
                    onPressed: () {
                      Get.back();
                    },
                  ),
                  Icon(FeatherIcons.fileText),
                  const SizedBox(width: 10),
                  Text(
                    widget.evaluator['title'],
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Icon(FeatherIcons.book, size: 15),
                  const SizedBox(width: 10),
                  Text(
                    widget.evaluator['class']['subject'],
                    style: const TextStyle(
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(width: 20),
                  Icon(FeatherIcons.users, size: 15),
                  const SizedBox(width: 10),
                  Text(
                    widget.evaluator['class']['name'],
                    style: const TextStyle(
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(width: 5),
                  Text(
                    widget.evaluator['class']['section'],
                    style: const TextStyle(
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Expanded(
                child: ListView(
                  children: [
                    Row(
                      children: [
                        Icon(FeatherIcons.fileText, size: 15),
                        const SizedBox(width: 10),
                        Text(
                          'Question Paper(s)',
                          style: const TextStyle(
                            fontSize: 16,
                          ),
                        )
                      ],
                    ),
                    const SizedBox(height: 20),
                    Wrap(
                      direction: Axis.horizontal,
                      children: getQuestionPaperWidgets(),
                    ),
                    Row(
                      children: [
                        Icon(FeatherIcons.key, size: 15),
                        const SizedBox(width: 10),
                        Text(
                          'Answer Key / Criteria',
                          style: const TextStyle(
                            fontSize: 16,
                          ),
                        )
                      ],
                    ),
                    const SizedBox(height: 20),
                    Wrap(
                      direction: Axis.horizontal,
                      children: getAnswerKeyWidgets(),
                    ),
                    Row(
                      children: [
                        Icon(FeatherIcons.key, size: 15),
                        const SizedBox(width: 10),
                        Text(
                          'Upload answer sheets',
                          style: const TextStyle(
                            fontSize: 16,
                          ),
                        )
                      ],
                    ),
                    const SizedBox(height: 10),
                    ...getAnswerSheetWidgets(),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  provider.evaluations.isEmpty
                      ? const SizedBox.shrink()
                      : Expanded(
                          child: ElevatedButton(
                            onPressed: () {
                              if (provider.evaluatingRollNo != -1) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Evaluation in progress...'),
                                    backgroundColor: Colors.red,
                                  ),
                                );
                                return;
                              }

                              Get.to(() => ResultScreen(
                                    evaluator: widget.evaluator,
                                  ));
                            },
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.all(15),
                              backgroundColor: Colors.white,
                              foregroundColor: primaryColor,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            child: const Text(
                              'View Results',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                  provider.evaluations.isEmpty
                      ? const SizedBox.shrink()
                      : const SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () async {
                        if (provider.evaluatingRollNo != -1) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Evaluation in progress...'),
                              backgroundColor: Colors.red,
                            ),
                          );
                          return;
                        }

                        var classProvider = Provider.of<ClassesProvider>(
                            context,
                            listen: false);
                        for (var student in classProvider.students) {
                          await provider.evaluate(
                              widget.evaluator["_id"], student["rollNo"]);
                        }

                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Evaluations completed'),
                            backgroundColor: Colors.green,
                          ),
                        );

                        Get.to(() => ResultScreen(
                              evaluator: widget.evaluator,
                            ));
                      },
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.all(15),
                        backgroundColor: primaryColor,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      child: const Text(
                        'Evaluate',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Opacity(
                opacity: 0.7,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(FeatherIcons.fileText, size: 15),
                    const SizedBox(width: 10),
                    Text(
                      "${provider.limits["evaluationLimit"]} evaluations remaining",
                      style: const TextStyle(
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  List<Widget> getQuestionPaperWidgets() {
    List<Widget> widgets = [];

    for (var questionPaper in widget.evaluator['questionPapers']) {
      widgets.add(
        GestureDetector(
          onTap: () {
            Get.to(() => ImageView(imageUrl: questionPaper));
          },
          child: Container(
            margin: const EdgeInsets.only(right: 10, bottom: 10),
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(10),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Image.network(
                questionPaper,
                width: 150,
                height: 150,
                fit: BoxFit.cover,
              ),
            ),
          ),
        ),
      );
    }

    return widgets;
  }

  List<Widget> getAnswerKeyWidgets() {
    List<Widget> widgets = [];

    for (var answerKey in widget.evaluator['answerKeys']) {
      widgets.add(
        GestureDetector(
          onTap: () {
            Get.to(() => ImageView(imageUrl: answerKey));
          },
          child: Container(
            margin: const EdgeInsets.only(right: 10, bottom: 10),
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(10),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Image.network(
                answerKey,
                width: 150,
                height: 150,
                fit: BoxFit.cover,
              ),
            ),
          ),
        ),
      );
    }

    return widgets;
  }

  List<Widget> getStudentAnswerSheetWidgets(int studentIndex) {
    List<Widget> widgets = [];
    var provider = Provider.of<EvaluatorsProvider>(context, listen: true);

    if (provider.evaluations.isEmpty) {
      return widgets;
    }

    for (var answerSheet in provider.evaluations["answerSheets"]
        [studentIndex]) {
      widgets.add(
        GestureDetector(
          onTap: () {
            Get.to(() => ImageView(imageUrl: answerSheet));
          },
          child: Padding(
            padding: EdgeInsets.only(right: 10, bottom: 10),
            child: Stack(
              children: [
                Container(
                  decoration: BoxDecoration(
                    color: Colors.grey[200],
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: Image.network(
                      answerSheet,
                      width: 150,
                      height: 150,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                Positioned(
                  right: 5,
                  top: 5,
                  child: GestureDetector(
                    onTap: () {
                      if (provider.evaluatingRollNo != -1) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Evaluation in progress...'),
                            backgroundColor: Colors.red,
                          ),
                        );
                        return;
                      }

                      showDialog(
                        context: context,
                        builder: (context) {
                          return AlertDialog(
                            title: const Text('Delete Answer Sheet'),
                            content: const Text(
                                'Are you sure you want to delete this answer sheet?'),
                            actions: [
                              TextButton(
                                onPressed: () {
                                  Navigator.pop(context);
                                },
                                child: const Text('Cancel'),
                              ),
                              TextButton(
                                onPressed: () {
                                  provider.deleteAnswerSheet(
                                      widget.evaluator["_id"],
                                      studentIndex,
                                      provider.evaluations["answerSheets"]
                                              [studentIndex]
                                          .indexOf(answerSheet));
                                  Navigator.pop(context);
                                },
                                child: const Text('Delete'),
                              ),
                            ],
                          );
                        },
                      );
                    },
                    child: Container(
                      padding: const EdgeInsets.all(5),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(
                        FeatherIcons.x,
                        size: 15,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return widgets;
  }

  List<Widget> getAnswerSheetWidgets() {
    List<Widget> widgets = [];

    List students =
        Provider.of<ClassesProvider>(context, listen: true).students;

    var provider = Provider.of<EvaluatorsProvider>(context, listen: false);
    var providerListen = Provider.of<EvaluatorsProvider>(context, listen: true);

    for (var student in students) {
      widgets.add(
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 10),
          child: Text(
            (students.indexOf(student) + 1).toString() + ". " + student['name'],
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      );

      widgets.add(
        Wrap(
          direction: Axis.horizontal,
          children: [
            ...getStudentAnswerSheetWidgets(students.indexOf(student)),
            provider.uploadingAnswerSheetStudentIndex ==
                    students.indexOf(student)
                ? const Padding(
                    padding: EdgeInsets.all(10),
                    child: CircularProgressIndicator(),
                  )
                : const SizedBox.shrink(),
          ],
        ),
      );

      widgets.add(
        providerListen.evaluatingRollNo == student["rollNo"]
            ? const Row(
                children: [
                  const CircularProgressIndicator(),
                  const SizedBox(width: 10),
                  const Text('Evaluating...'),
                ],
              )
            : const SizedBox.shrink(),
      );

      widgets.add(
        providerListen.evaluatingRollNo != -1
            ? const SizedBox.shrink()
            : Padding(
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: Row(
                  children: [
                    TextButton.icon(
                      onPressed: () async {
                        final ImagePicker _picker = ImagePicker();
                        XFile? files =
                            await _picker.pickImage(source: ImageSource.camera);

                        File file = File(files!.path);

                        provider.uploadAnswerSheet(widget.evaluator["_id"],
                            file, students.indexOf(student));
                      },
                      icon: const Icon(FeatherIcons.camera),
                      label: const Text('Camera'),
                      style: TextButton.styleFrom(
                        foregroundColor: Colors.white,
                        backgroundColor: primaryColor,
                      ),
                    ),
                    const SizedBox(width: 10),
                    TextButton.icon(
                      onPressed: () async {
                        final ImagePicker _picker = ImagePicker();
                        XFile? files = await _picker.pickImage(
                            source: ImageSource.gallery);

                        File file = File(files!.path);

                        provider.uploadAnswerSheet(widget.evaluator["_id"],
                            file, students.indexOf(student));
                      },
                      icon: const Icon(FeatherIcons.image),
                      label: const Text('Gallery'),
                      style: TextButton.styleFrom(
                        foregroundColor: Colors.white,
                        backgroundColor: primaryColor,
                      ),
                    ),
                  ],
                ),
              ),
      );
    }

    return widgets;
  }
}
