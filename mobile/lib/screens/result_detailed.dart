import 'package:evaluateai/providers/classes.dart';
import 'package:evaluateai/providers/evaluators.dart';
import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class DetailedResultScreen extends StatefulWidget {
  final Map evaluator;
  final int studentIndex;
  const DetailedResultScreen(
      {super.key, required this.evaluator, required this.studentIndex});

  @override
  State<DetailedResultScreen> createState() => _DetailedResultScreenState();
}

class _DetailedResultScreenState extends State<DetailedResultScreen> {
  int _selectedStudentIndex = 0;

  @override
  void initState() {
    var classProvider = Provider.of<ClassesProvider>(context, listen: false);
    classProvider.getStudents(widget.evaluator['class']["_id"]);
    Provider.of<EvaluatorsProvider>(context, listen: false).getResultDetailed(
      widget.evaluator['_id'],
      classProvider.students[widget.studentIndex]['rollNo'],
    );
    setState(() {
      _selectedStudentIndex = widget.studentIndex;
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    var classProvider = Provider.of<ClassesProvider>(context, listen: true);
    var evaluatorProvider =
        Provider.of<EvaluatorsProvider>(context, listen: true);

    return Scaffold(
      body: Container(
        padding: const EdgeInsets.all(20),
        width: Get.width,
        height: Get.height,
        child: SafeArea(
          child: Column(
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
                    "Detailed Result",
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
              Row(
                children: [
                  Icon(FeatherIcons.user),
                  const SizedBox(width: 10),
                  Text(
                    'Student',
                    style: const TextStyle(
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              DropdownButtonFormField(
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  filled: true,
                ),
                items: classProvider.students.asMap().entries.map((entry) {
                  int idx = entry.key;
                  var student = entry.value;
                  return DropdownMenuItem(
                    child: Text(student['name']),
                    value: idx,
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedStudentIndex = value!;
                  });
                  evaluatorProvider.getResultDetailed(
                    widget.evaluator['_id'],
                    classProvider.students[_selectedStudentIndex]['rollNo'],
                  );
                },
                value: _selectedStudentIndex,
              ),
              const SizedBox(height: 20),
              Expanded(
                  child: ListView(
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        "Total marks scored",
                        style: const TextStyle(
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        evaluatorProvider.detailedResult['score'][0]
                                .toString() +
                            " / " +
                            evaluatorProvider.detailedResult['score'][1]
                                .toString(),
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  ...getResultsWidgets(),
                ],
              ))
            ],
          ),
        ),
      ),
    );
  }

  List<Widget> getResultsWidgets() {
    List<Widget> widgets = [];

    var evaluatorProvider =
        Provider.of<EvaluatorsProvider>(context, listen: true);

    for (var result in evaluatorProvider.detailedResult['results']) {
      widgets.add(Container(
        width: Get.width,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: primaryColor,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                children: [
                  Icon(
                    FeatherIcons.helpCircle,
                    color: Colors.white,
                  ),
                  const SizedBox(width: 10),
                  Text(
                    "Question ${result['question_no']}",
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),
            Text(
              result['question'],
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                children: [
                  Icon(FeatherIcons.edit3),
                  const SizedBox(width: 10),
                  Text(
                    "Answer: ",
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),
            Text(
              result['answer'],
              style: const TextStyle(
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                children: [
                  Icon(Icons.emoji_events),
                  const SizedBox(width: 10),
                  Text(
                    "Score: ",
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),
            Text(
              result['score'][0].toString() +
                  " / " +
                  result['score'][1].toString(),
              style: const TextStyle(
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                children: [
                  Icon(FeatherIcons.info),
                  const SizedBox(width: 10),
                  Text(
                    "Remarks: ",
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),
            Text(
              result['remarks'],
              style: const TextStyle(
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ));
    }

    return widgets;
  }
}
