import 'package:evaluateai/providers/evaluators.dart';
import 'package:evaluateai/screens/result_detailed.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class ResultScreen extends StatefulWidget {
  final Map evaluator;
  const ResultScreen({super.key, required this.evaluator});

  @override
  State<ResultScreen> createState() => _ResultScreenState();
}

class _ResultScreenState extends State<ResultScreen> {
  @override
  void initState() {
    Provider.of<EvaluatorsProvider>(context, listen: false)
        .getResultsAll(widget.evaluator['_id']);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
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
              Expanded(
                child: ListView.builder(
                    itemCount:
                        Provider.of<EvaluatorsProvider>(context, listen: true)
                            .allResults["results"]
                            .length,
                    itemBuilder: (context, index) {
                      return ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: Text(
                          Provider.of<EvaluatorsProvider>(context, listen: true)
                                  .allResults["results"][index]['roll_no']
                                  .toString() +
                              ". " +
                              Provider.of<EvaluatorsProvider>(context,
                                      listen: true)
                                  .allResults["results"][index]['student_name'],
                        ),
                        subtitle: Text(
                          "Score: " +
                              Provider.of<EvaluatorsProvider>(context,
                                      listen: true)
                                  .allResults["results"][index]['score']
                                  .toString(),
                        ),
                        trailing: IconButton(
                          onPressed: () => {},
                          tooltip: "View Detailed Result",
                          icon: Icon(
                            FeatherIcons.arrowRight,
                          ),
                        ),
                        onTap: () {
                          Get.to(() => DetailedResultScreen(
                              evaluator: widget.evaluator,
                              studentIndex: index));
                        },
                      );
                    }),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
