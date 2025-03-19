import 'package:evaluateai/providers/evaluator.dart';
import 'package:evaluateai/screens/evaluator/evaluator.dart';
import 'package:evaluateai/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class EvaluatorsPage extends StatefulWidget {
  const EvaluatorsPage({super.key});

  @override
  State<EvaluatorsPage> createState() => _EvaluatorsPageState();
}

class _EvaluatorsPageState extends State<EvaluatorsPage> {
  @override
  void initState() {
    Provider.of<EvaluatorProvider>(Get.context!, listen: false).getEvaluators();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    var evaluatorProvider =
        Provider.of<EvaluatorProvider>(context, listen: true);

    return Container(
      width: Get.width,
      height: Get.height,
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(FeatherIcons.play),
              const SizedBox(width: 10),
              Text(
                "Evaluators",
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async {
                evaluatorProvider.getEvaluators();
              },
              child: ListView.builder(
                itemCount: evaluatorProvider.evaluators.length,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 10.0),
                    child: InkWell(
                      onTap: () {
                        evaluatorProvider.selectEvaluator(
                            evaluatorProvider.evaluators[index]["_id"]);
                        Get.to(() => EvaluatorScreen());
                      },
                      borderRadius: BorderRadius.circular(15),
                      child: Container(
                        padding: EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          border: Border.all(
                            color: Colors.grey.withAlpha(50),
                            width: 4,
                          ),
                          borderRadius: BorderRadius.circular(15),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(FeatherIcons.play),
                                SizedBox(
                                  width: 10,
                                ),
                                Text(
                                  evaluatorProvider.evaluators[index]["title"],
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(
                              height: 10,
                            ),
                            Text(
                              evaluatorProvider.evaluators[index]
                                  ["description"],
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                                color: Colors.black.withAlpha(150),
                              ),
                            ),
                            SizedBox(
                              height: 30,
                            ),
                            Row(
                              children: [
                                Container(
                                  padding: EdgeInsets.symmetric(
                                      vertical: 5, horizontal: 15),
                                  decoration: BoxDecoration(
                                    color: primaryColor.withAlpha(30),
                                    borderRadius: BorderRadius.circular(50),
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(
                                        FeatherIcons.users,
                                        size: 18,
                                        color: primaryColor,
                                      ),
                                      SizedBox(
                                        width: 10,
                                      ),
                                      Text(
                                        "${evaluatorProvider.evaluators[index]["classId"]["name"]} ${evaluatorProvider.evaluators[index]["classId"]["section"]}",
                                        style: TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.bold,
                                          color: primaryColor,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                SizedBox(
                                  width: 10,
                                ),
                                Container(
                                  padding: EdgeInsets.symmetric(
                                      vertical: 5, horizontal: 15),
                                  decoration: BoxDecoration(
                                    color: secondaryColor.withAlpha(30),
                                    borderRadius: BorderRadius.circular(50),
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(
                                        FeatherIcons.bookOpen,
                                        size: 18,
                                        color: secondaryColor,
                                      ),
                                      SizedBox(
                                        width: 10,
                                      ),
                                      Text(
                                        evaluatorProvider.evaluators[index]
                                            ["classId"]["subject"],
                                        style: TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.bold,
                                          color: secondaryColor,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}
