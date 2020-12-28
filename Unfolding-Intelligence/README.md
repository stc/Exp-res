# Songlines

A songline, also called dreaming track, is one of the paths across the land (or sometimes the sky) within the animist belief system of The First Nations People of ‘Australia’ , which mark the route followed by localised "creator-beings" during the Dreaming. The paths of the songlines are recorded in traditional song cycles, stories, dance, and art, and are often the basis of ceremonies. They are a vital part of Aboriginal culture, connecting people to their land.

This experiment is a musical game, with a tribute to visual music notation, improvisation, and songlines. The behaviour of the two agents are based on reinforcement learning, they learn from their environment. They are seeking food provided by your touch, while trying to keep distance from the auto generated dark objects. What they see and percieve from their surrounding is the sonic instrument itself. The unfolding paths and tracks resemble a minimalistic algorithmic representation of their presence in their world, constructing songs based on their moving lines. 

At the end of each musical composition, a small statement can be read about the cultural references of songlines. What is interesting in these thought fragments is that they begin with a sentence written by a human then a transformer-based artificial language model, based on the GPT-2 model by OpenAI, intakes this partial sentence and predicts subsequent text from that input.

### Technical Notes

The reinforcement learning implementation is based on A. Karpathy's ReinforceJS library, for full documentation and original demos visit [A. Karpathy's Webpage](http://cs.stanford.edu/people/karpathy/reinforcejs).

The gpt-2 based pre-generated text fragments are made with [DeepAI's text generation API](https://deepai.org/machine-learning-model/text-generator).

Sound generation is made with [Tone.js](https://tonejs.github.io/), visualization and UI is built with [p5.js](https://p5js.org/).


