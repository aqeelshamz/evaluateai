import 'package:evaluateai/providers/evaluator.dart';
import 'package:evaluateai/providers/user.dart';
import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class EvaluatePage extends StatefulWidget {
  const EvaluatePage({super.key});

  @override
  State<EvaluatePage> createState() => _EvaluatePageState();
}

class _EvaluatePageState extends State<EvaluatePage> {
  TextEditingController promptController = TextEditingController();
  TextEditingController totalMarksController = TextEditingController();
  String prompt = "";
  int totalMarks = 100;

  @override
  void initState() {
    getData();
    super.initState();
  }

  void getData() async {
    Provider.of<UserProvider>(Get.context!, listen: false).getLimits();
    var evaluatorProvider =
        Provider.of<EvaluatorProvider>(Get.context!, listen: false);
    await evaluatorProvider.getEvaluator();
    promptController.text = evaluatorProvider.evaluatorData["extraPrompt"];
    totalMarksController.text =
        evaluatorProvider.evaluatorData["totalMarks"].toString();
  }

  @override
  Widget build(BuildContext context) {
    var userProvider = Provider.of<UserProvider>(context, listen: true);
    var evaluatorProvider =
        Provider.of<EvaluatorProvider>(context, listen: true);

    return Container(
      width: Get.width,
      height: Get.height,
      padding: const EdgeInsets.all(20),
      child: ListView(
        children: [
          Text("Extra prompt (optional)"),
          const SizedBox(height: 10),
          TextField(
            controller: promptController,
            onChanged: (value) {
              prompt = value;
            },
            decoration: InputDecoration(
              hintText: "Prompt",
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15),
              ),
            ),
            maxLines: 4,
          ),
          const SizedBox(height: 20),
          Text("Total Marks"),
          const SizedBox(height: 10),
          TextField(
            controller: totalMarksController,
            onChanged: (value) {
              totalMarks = int.parse(value == "" ? "100" : value);
            },
            keyboardType: TextInputType.number,
            decoration: InputDecoration(
              hintText: "Total Marks",
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15),
              ),
            ),
          ),
          const SizedBox(height: 20),
          TextButton.icon(
            onPressed: () {
              if (evaluatorProvider.evaluating) {
                return;
              }

              evaluatorProvider.evaluate();
            },
            style: TextButton.styleFrom(
              padding: EdgeInsets.symmetric(vertical: 15),
              backgroundColor: primaryColor,
              foregroundColor: Colors.white,
            ),
            icon: evaluatorProvider.evaluating
                ? SizedBox(
                    width: 10,
                    height: 10,
                    child: CircularProgressIndicator(
                      color: Colors.white,
                      strokeWidth: 2,
                    ),
                  )
                : Icon(FeatherIcons.play),
            label: Text(
                evaluatorProvider.evaluating ? "Evaluating..." : "Evaluate"),
          ),
          const SizedBox(height: 10),
          Center(
            child: Text(
              "${userProvider.limits["evaluationLimit"] - userProvider.limits["evaluationUsage"]} evaluations left.",
            ),
          ),
          const SizedBox(height: 20),
          evaluatorProvider.evaluating
              ? Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: getEvaluationProgressWidgets(),
                )
              : const SizedBox.shrink()
        ],
      ),
    );
  }

  List<Widget> getEvaluationProgressWidgets() {
    List<Widget> widgets = [];

    var evaluatorProvider =
        Provider.of<EvaluatorProvider>(context, listen: true);

    for (int i = 0;
        i < evaluatorProvider.evaluationData["evaluation"].keys.length;
        i++) {
      var data = evaluatorProvider.evaluationData["evaluation"]
          [evaluatorProvider.evaluationData["evaluation"].keys.toList()[i]];
      widgets.add(
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 10),
          child: Row(
            children: [
              data["isCompleted"]
                  ? Icon(
                      Icons.check_circle,
                      color: Colors.green,
                    )
                  : SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 3,
                      ),
                    ),
              SizedBox(width: 10),
              Text(
                  "${data["isCompleted"] ? "Evaluated" : "Evaluating"} answer sheets of Roll No. ${data["studentRollNo"]} ${data["isCompleted"] ? "" : "..."}"),
            ],
          ),
        ),
      );
    }

    return widgets;
  }
}
